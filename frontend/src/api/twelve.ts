import axios from "axios";
import { backend } from "../lib/axios";

export const createTask = async (videoUrl: string, indexId: string, userId: string) => {
    try {
        const body = {
            videoUrl,
            indexId,
            userId
        };

        // console.log(body);
    
        const response = await backend.post(`/twelve/createtask`, body);
        if (response.status !== 200) {
            console.error("Error creating task:", response.status);
            return null;
        }
    
        return response;

    } catch (error) {
        console.error("Error creating task:", error);
        return null;
    }
}

export const getTasks = async (userId: string) => {
    try {
        const response = await backend.get(`/twelve/tasks?userId=${userId}`);
        if (response.status !== 200) {
            console.error("Error fetching tasks:", response.status);
            return null;
        }
        // console.log(response);
        return response.data;
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return null;
    }
}