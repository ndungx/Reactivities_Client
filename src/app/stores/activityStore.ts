import { HubConnection, HubConnectionBuilder, LogLevel } from "@aspnet/signalr";
import { action, computed, observable, reaction, runInAction, toJS } from "mobx";
import { SyntheticEvent } from "react";
import { toast } from "react-toastify";
import { history } from "../..";
import agents from "../api/agents";
import { createAttendee, setActivityProps } from "../common/utils/utils";
import { IActivity } from "../models/activity";
import { RootStore } from "./rootStore";

const LIMIT = 2;

export default class ActivityStore {
    rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;

        reaction(
            () => this.predicate.keys(),
            () => {
                this.page = 0;
                this.activityRegistry.clear();
                this.loadActivities();
            }
        );
    }

    @observable activityRegistry = new Map();
    @observable activity: IActivity | null = null;
    @observable loadingInitial = false;
    @observable submitting = false;
    @observable target = "";
    @observable loading = false;
    @observable.ref hubConnection: HubConnection | null = null;
    @observable activityCount = 0;
    @observable page = 0;
    @observable predicate = new Map();

    @action setPredicate = (predicate: string, value: string | Date) => {
        this.predicate.clear();
        if (predicate !== "all") {
            this.predicate.set(predicate, value);
        }
    }

    @computed get axiosParams() {
        const params = new URLSearchParams();
        params.append("limit", String(LIMIT));
        params.append("offset", `${this.page ? this.page * LIMIT : 0}`);
        this.predicate.forEach((value, key) => {
            if (key === 'startDate') {
                params.append(key, value.toISOString());
            } else {
                params.append(key, value);
            }
        });

        return params;
    }

    @computed get totalPages() {
        return Math.ceil(this.activityCount / LIMIT);
    }

    @action setPage = (page: number) => {
        this.page = page;
    }

    @action createHubConnection = (activityId: string) => {
        this.hubConnection = new HubConnectionBuilder()
            .withUrl(
                process.env.REACT_APP_API_CHAT_URL!,
                {
                    accessTokenFactory: () => this.rootStore.commonStore.token!
                }
            )
            .configureLogging(LogLevel.Information)
            .build();

        this.hubConnection
            .start()
            .then(() => console.log(this.hubConnection!.state))
            .then(() => {
                console.log('Attempting to join group');
                this.hubConnection?.invoke("AddToGroup", activityId);
            })
            .catch(error => console.log("Error establishing connection: ", error));

        this.hubConnection.on("ReceiveComment", comment => {
            runInAction(() => {
                this.activity!.comments.push(comment);
            });
        });
    }

    @action stopHubConnection = () => {
        this.hubConnection!.invoke("RemoveFromGroup", this.activity!.id)
            .then(() => this.hubConnection!.stop())
            .then(() => console.log("Connection stopped"))
            .catch(err => console.log(err));
    }

    @action addComment = async (values: any) => {
        values.activityId = this.activity!.id;

        try {
            await this.hubConnection!.invoke("SendComment", values);
        } catch (error) {
            console.log(error);
        }
    }

    @computed get activitiesByDate() {
        return this.groupActivityByDate(
            Array.from(this.activityRegistry.values())
        );
    }

    groupActivityByDate(activities: IActivity[]) {
        const sortedActivities = activities.sort(
            (a, b) => a.date.getTime() - b.date.getTime()
        );
        return Object.entries(
            sortedActivities.reduce(
                (activities, activity) => {
                    const date = activity.date.toISOString().split("T")[0];
                    activities[date] = activities[date]
                        ? [...activities[date], activity]
                        : [activity];
                    return activities;
                }, {} as { [key: string]: IActivity[] }
            )
        );
    }

    @action loadActivities = async () => {
        this.loadingInitial = true;

        try {
            const activitiesEnvelope = await agents.Activities.list(this.axiosParams);
            const { activities, activityCount } = activitiesEnvelope;

            runInAction('loading activities', () => {
                activities.forEach((activity) => {
                    setActivityProps(activity, this.rootStore.userStore.user!);
                    this.activityRegistry.set(activity.id, activity);
                });
                this.activityCount = activityCount;

                this.loadingInitial = false;
            })
        } catch (err) {
            console.log(err);
            runInAction('loading activities error', () => this.loadingInitial = false);
        }
    }

    @action loadActivity = async (id: string) => {
        let activity = this.getActivity(id);

        if (activity) {
            this.activity = activity;

            return toJS(activity);
        } else {
            this.loadingInitial = true;

            try {
                activity = await agents.Activities.details(id);

                runInAction('getting activity', () => {
                    setActivityProps(activity, this.rootStore.userStore.user!);
                    this.activity = activity;
                    this.activityRegistry.set(activity.id, activity);
                    this.loadingInitial = false;
                })

                return activity;
            } catch (err) {
                console.log(err);
                runInAction('getting activity error', () => this.loadingInitial = false);
            }
        }
    }

    @action clearActivity = () => {
        this.activity = null;
    }

    getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    }

    @action createActivity = async (activity: IActivity) => {
        this.submitting = true;

        try {
            await agents.Activities.create(activity);

            const attendee = createAttendee(this.rootStore.userStore.user!);
            attendee.isHost = true;
            let attendees = [];
            attendees.push(attendee);
            activity.attendees = attendees;
            activity.isHost = true;
            activity.comments = [];

            runInAction('creating activity', () => {
                this.activityRegistry.set(activity.id, activity);
                this.submitting = false;
            });

            history.push(`/activities/${activity.id}`);
        } catch (err: any) {
            console.log(err.response);
            runInAction('creating activity error', () => this.submitting = false);
            toast.error('Problem submitting data');
        }
    }

    @action editActivity = async (activity: IActivity) => {
        this.submitting = true;

        try {
            await agents.Activities.update(activity);

            runInAction('editing activity', () => {
                this.activityRegistry.set(activity.id, activity);
                this.activity = activity;
                this.submitting = false;
            });

            history.push(`/activities/${activity.id}`);
        } catch (err: any) {
            console.log(err.response);
            runInAction('editing activity error', () => this.submitting = false);
        }
    }

    @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
        this.submitting = true;
        this.target = event.currentTarget.name;

        try {
            await agents.Activities.delete(id);

            runInAction('deleting activity', () => {
                this.activityRegistry.delete(id);
                this.submitting = false;
                this.target = "";
            });
        } catch (err) {
            console.log(err);
            runInAction('deleting activity error', () => {
                this.submitting = false;
                this.target = "";
            });
        }
    }

    @action attendActivity = async () => {
        const attendee = createAttendee(this.rootStore.userStore.user!);
        this.loading = true;

        try {
            await agents.Activities.attend(this.activity!.id);

            runInAction('attend activity', () => {
                if (this.activity) {
                    this.activity.attendees.push(attendee);
                    this.activity.isGoing = true;
                    this.activityRegistry.set(this.activity.id, this.activity);
                    this.loading = false;
                }
            })
        } catch (error) {
            runInAction('attend activity error', () => this.loading = false);
            toast.error('Problem signing up to activity');
        }
    }

    @action cancelAttendance = async () => {
        try {
            await agents.Activities.unattend(this.activity!.id);

            runInAction('cancel attendance', () => {
                if (this.activity) {
                    this.activity.attendees = this.activity.attendees.filter(
                        (a) => a.username !== this.rootStore.userStore.user!.username
                    );
                    this.activity.isGoing = false;
                    this.activityRegistry.set(this.activity.id, this.activity);
                    this.loading = false;
                }
            })
        } catch (error) {
            toast.error('Problem cancelling attendance');
            runInAction('cancel attendance error', () => this.loading = false);
        }
    }
}