import axios, { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { history } from "../..";
import { IActivity } from "../models/activity";

axios.defaults.baseURL = "http://localhost:5000/api";

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

    throw err;
});

const responseBody = (response: AxiosResponse) => response.data;

const request = {
    get: (url: string) => axios.get(url).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody)
}

const Activities = {
    list: (): Promise<IActivity[]> => request.get("/activities"),
    details: (id: string) => request.get(`/activities/${id}`),
    create: (activity: IActivity) => request.post("/activities", activity),
    update: (activity: IActivity) => request.put(`/activities/${activity.id}`, activity),
    delete: (id: string) => request.delete(`/activities/${id}`)
}

const exportedObject = {
    Activities,
}

export default exportedObject