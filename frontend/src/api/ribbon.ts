import axios from "axios";
import { backend } from "../lib/axios";
import type { JobInterface } from "./rapid";

export const createTemplate = async (job: JobInterface, userId: string) => {
    try {
        const body = {
            oname: job.employer_name,
            title: job.job_title,
            description: job.job_description
        }

        const response = await backend.post(`/ribbon/createflow?userId=${userId}`, body);
        if (response.status !== 201) {
            console.error("Error creating template:", response.status);
            return null;
        }

        return {
            message: "Template created successfully",
            data: response.data
        };
    } catch (error) {
        console.error("Error creating template:", error);
        return null;
    }
}