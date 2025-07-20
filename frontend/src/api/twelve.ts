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

// Update your analyzeVideo function in twelve.ts
export const analyzeVideo = async (taskId: string) => {
    try {
        const response = await backend.post(`/twelve/analyze`, { taskId });
        
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error(`Analysis failed with status ${response.status}`);
        }

    } catch (error: any) {
        console.error("Error analyzing video:", error);
        throw error; // Re-throw to be caught by the caller
    }
}