import axios from "axios";
import { backend } from "../lib/axios";

export interface TranscriptItem {
    content: string;
    role: "agent" | "user";
}

export interface QuestionToTranscriptMapping {
    end_timestamp: number;
    script_question: string;
    start_timestamp: number;
    transcript_item_indices: number[];
    transcript_items: TranscriptItem[];
}


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

export const analyzeResults = async (
    videoUrl: string,
    questionsToTranscriptMapping: QuestionToTranscriptMapping[]
) => {
    try {
        const response = await backend.post("/twelve/analyze", {
            videoUrl,
            questions_to_transcript_mapping: questionsToTranscriptMapping,
        });
        if (response.status !== 200) {
            console.error("Error analyzing results:", response.status);
            return null;
        }
        return response.data;
    } catch (error) {
        console.error("Error analyzing results:", error);
        return null;
    }
};

