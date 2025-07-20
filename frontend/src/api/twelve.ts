import axios from "axios";
import { backend } from "../lib/axios";

export const createTask = async (videoUrl: string, indexId: string, userId: string) => {
    try {
        const body = {
        videoUrl,
        indexId,
        userId
        };
    
        const response = await backend.post(`/twelve/createtask`, body);
        if (response.status !== 201) {
            console.error("Error creating task:", response.status);
            return null;
        }
    
        return {
        message: "Task created successfully",
        data: response.data
        };
        
    } catch (error) {
        console.error("Error creating task:", error);
        return null;
    }
}