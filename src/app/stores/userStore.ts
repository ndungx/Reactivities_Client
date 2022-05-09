import { action, computed, observable, runInAction } from "mobx";
import { history } from "../..";
import agents from "../api/agents";
import { IUser, IUserFormValues } from "../models/user";
import { RootStore } from "./rootStore";

export default class UserStore {
    refreshTokenTimeout: any;
    rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }

    @observable user: IUser | null = null;
    @observable loading = false;

    @computed get isLoggedIn() {
        return !!this.user;
    }

    @action register = async (values: IUserFormValues) => {
        try {
            const user = await agents.User.register(values);
            runInAction(() => this.user = user);
            this.rootStore.commonStore.setToken(user.token);
            this.startRefreshTokenTimer(user);
            this.rootStore.modalStore.closeModal();
            history.push('/activities');
        } catch (error) {
            throw error;
        }
    }

    @action login = async (values: IUserFormValues) => {
        try {
            const user = await agents.User.login(values);
            runInAction(() => this.user = user);
            this.rootStore.commonStore.setToken(user.token);
            this.startRefreshTokenTimer(user);
            this.rootStore.modalStore.closeModal();
            history.push('/activities');
        } catch (error) {
            throw error;
        }
    }

    @action refreshToken = async () => {
        this.stopRefreshTokenTimer();

        try {
            const user = await agents.User.refreshToken();
            runInAction(() => {
                this.user = user;
            });
            this.rootStore.commonStore.setToken(user.token);
            this.startRefreshTokenTimer(user);
        } catch (error) {
            throw error;
        }
    }

    @action getUser = async () => {
        try {
            const user = await agents.User.current();
            runInAction(() => {
                this.user = user;
            });
            this.rootStore.commonStore.setToken(user.token);
            this.startRefreshTokenTimer(user);
        } catch (error) {
            console.log(error);
        }
    }

    @action logout = () => {
        this.rootStore.commonStore.setToken(null);
        this.user = null;
        history.push('/');
    }

    @action fbLogin = async (response: any) => {
        this.loading = true;

        try {
            const user = await agents.User.fbLogin(response.accessToken);
            runInAction(() => {
                this.user = user;
                this.rootStore.commonStore.setToken(user.token);
                this.startRefreshTokenTimer(user);
                this.rootStore.modalStore.closeModal();
                history.push('/activities');
                this.loading = false;
            });
        } catch (error) {
            this.loading = false;
            throw error;
        }
    }

    private startRefreshTokenTimer(user: IUser) {
        const jwtToken = JSON.parse(atob(user.token.split('.')[1]));
        const expires = new Date(jwtToken.exp * 1000);
        const timeout = expires.getTime() - Date.now() - (60 * 1000);
        this.refreshTokenTimeout = setTimeout(this.refreshToken, timeout);
    }

    private stopRefreshTokenTimer() {
        clearTimeout(this.refreshTokenTimeout);
    }
}