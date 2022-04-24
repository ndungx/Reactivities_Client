import axios, { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { history } from "../..";
import { IActivity } from "../models/activity";
import { IPhoto, IProfile } from "../models/profile";
import { IUser, IUserFormValues } from "../models/user";

axios.defaults.baseURL = "http://localhost:5000/api";

axios.interceptors.request.use((config) => {
    const token = window.localStorage.getItem("jwt");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
}, error => {
    return Promise.reject(error);
});

axios.interceptors.response.use(undefined, err => {
    if (err.message === "Network Error" && err.response === undefined) {
        toast.error("Network error when communicate with server!");
    }

    const { status, data, config } = err.response;

    if (status === 404) {
        history.push("/notfound");
    }

    if (status === 400 && config.method === 'get' && data.errors.hasOwnProperty('id')) {
        history.push("/notfound");
    }

    if (status === 500) {
        toast.error("Server error - something went wrong!");
    }

    throw err.response;
});

const responseBody = (response: AxiosResponse) => response.data;

const request = {
    get: (url: string) => axios.get(url).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody),
    postForm: async (url: string, file: Blob) => {
        let formData = new FormData();

        formData.append("File", file);

        const response = await axios.post(url, formData, {
            headers: { 'Content-type': 'multipart/form-data' }
        });
        return responseBody(response);
    }
}

const Activities = {
    list: (): Promise<IActivity[]> => request.get("/activities"),
    details: (id: string) => request.get(`/activities/${id}`),
    create: (activity: IActivity) => request.post("/activities", activity),
    update: (activity: IActivity) => request.put(`/activities/${activity.id}`, activity),
    delete: (id: string) => request.delete(`/activities/${id}`),
    attend: (id: string) => request.post(`/activities/${id}/attend`, {}),
    unattend: (id: string) => request.delete(`/activities/${id}/attend`)
}

const User = {
    current: (): Promise<IUser> => request.get("/user"),
    login: (user: IUserFormValues): Promise<IUser> => request.post("/user/login", user),
    register: (user: IUserFormValues): Promise<IUser> => request.post("/user/register", user)
}

const Profiles = {
    get: (username: string): Promise<IProfile> => request.get(`/profiles/${username}`),
    uploadPhoto: (photo: Blob): Promise<IPhoto> => request.postForm(`/photos`, photo),
    setMainPhoto: (id: string) => request.post(`/photos/${id}/setmain`, {}),
    deletePhoto: (id: string) => request.delete(`/photos/${id}`),
}

const exportedObject = {
    Activities,
    User,
    Profiles,
}

export default exportedObject