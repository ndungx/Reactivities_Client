import { action, computed, observable, reaction, runInAction } from "mobx";
import { toast } from "react-toastify";
import agents from "../api/agents";
import { IPhoto, IProfile } from "../models/profile";
import { RootStore } from "./rootStore";

export default class ProfileStore {
    rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;

        reaction(
            () => this.activeTab,
            activeTab => {
                if (activeTab === 3 || activeTab === 4) {
                    const predicate = activeTab === 3 ? "followers" : "following";
                    this.loadFollowings(predicate);
                } else {
                    this.followings = [];
                }
            }
        );
    }

    @observable profile: IProfile | null = null;
    @observable loadingProfile = true;
    @observable uploadingPhoto = false;
    @observable loading = false;
    @observable followings: IProfile[] = [];
    @observable activeTab: number = 0;

    @computed get isCurrentUser() {
        if (this.rootStore.userStore.user && this.profile) {
            return this.rootStore.userStore.user.username === this.profile.username;
        } else {
            return false;
        }
    }

    @action setActiveTab = (activeIndex: number) => {
        this.activeTab = activeIndex;
    }

    @action loadProfile = async (username: string) => {
        this.loadingProfile = true;

        try {
            const profile = await agents.Profiles.get(username);

            runInAction('loading profile', () => {
                this.profile = profile;
                this.loadingProfile = false;
            });
        } catch (error) {
            console.log(error);
            runInAction('loading profile error', () => this.loadingProfile = false);
        }
    }

    @action uploadPhoto = async (file: Blob) => {
        this.uploadingPhoto = true;

        try {
            const photo = await agents.Profiles.uploadPhoto(file);

            runInAction('uploading photo', () => {
                if (this.profile) {
                    this.profile.photos.push(photo);

                    if (photo.isMain && this.rootStore.userStore.user) {
                        this.rootStore.userStore.user.image = photo.url;
                        this.profile.image = photo.url;
                    }
                }

                this.uploadingPhoto = false;
            });
        } catch (error) {
            console.log(error);
            toast.error('Problem uploading photo');
            runInAction('uploading photo error', () => this.uploadingPhoto = false);
        }
    }

    @action setMainPhoto = async (photo: IPhoto) => {
        this.loading = true;

        try {
            await agents.Profiles.setMainPhoto(photo.id);
            runInAction('setting main photo', () => {
                this.rootStore.userStore.user!.image = photo.url;
                this.profile!.photos.find(a => a.isMain)!.isMain = false;
                this.profile!.photos.find(a => a.id === photo.id)!.isMain = true;
                this.profile!.image = photo.url;
                this.loading = false;
            });
        } catch (error) {
            console.log(error);
            toast.error('Problem setting photo as main');
            runInAction('setting main photo error', () => this.loading = false);
        }
    }

    @action deletePhoto = async (photo: IPhoto) => {
        this.loading = true;

        try {
            await agents.Profiles.deletePhoto(photo.id);
            runInAction('deleting photo', () => {
                this.profile!.photos = this.profile!.photos.filter(a => a.id !== photo.id);
                this.loading = false;
            });
        } catch (error) {
            console.log(error);
            toast.error('Problem deleting photo');
            this.loading = false;
        }
    }

    @action updateProfile = async (profile: Partial<IProfile>) => {
        try {
            await agents.Profiles.updateProfile(profile);
            runInAction('updating profile', () => {
                if (profile.displayName !== this.rootStore.userStore.user!.displayName) {
                    this.rootStore.userStore.user!.displayName = profile.displayName!;
                }
                this.profile = { ...this.profile!, ...profile };
            });
        } catch (error) {
            console.log(error);
            toast.error('Problem updating profile');
        }
    }

    @action follow = async (username: string) => {
        this.loading = true;

        try {
            await agents.Profiles.follow(username);
            runInAction('following', () => {
                this.profile!.following = true;
                this.profile!.followersCount++;
                this.loading = false;
            });
        } catch (error) {
            console.log(error);
            toast.error('Problem following user');
            runInAction('following user error', () => this.loading = false);
        }
    }

    @action unfollow = async (username: string) => {
        this.loading = true;

        try {
            await agents.Profiles.unfollow(username);
            runInAction('unfollowing', () => {
                this.profile!.following = false;
                this.profile!.followersCount--;
                this.loading = false;
            });
        } catch (error) {
            console.log(error);
            toast.error('Problem unfollowing user');
            runInAction('unfollowing user error', () => this.loading = false);
        }
    }

    @action loadFollowings = async (predicate: string) => {
        this.loading = true;

        try {
            const profiles = await agents.Profiles.listFollowings(this.profile!.username, predicate);
            runInAction('loading followings', () => {
                this.followings = profiles;
                this.loading = false;
            });
        } catch (error) {
            console.log(error);
            toast.error('Problem loading followings');
            runInAction('loading followings error', () => this.loading = false);
        }
    }
}