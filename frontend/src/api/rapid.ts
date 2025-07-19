import axios from 'axios';

export interface JobInterface {
        employer_name: string;
        employer_website: string;
        job_title: string;
        job_employment_type: string;
        job_is_remote: boolean;
        job_posted_at_datetime_utc: string;
        description: string;
        job_location: string;
        job_country: string;
        job_description: string; // Optional field
        job_id: string; // Optional field
}

export interface QueryInterface {
    parameters: {
        country: string;
        date_posted: string;
        language: String,
        num_pages: Number,
        page: Number,
        query: String
    },
    request_id: string;
    status: string;
    data: JobInterface[]
}

export const getJobsFilter = async () => {
    try {
        const options = {
            method: 'GET',
            url: 'https://jsearch.p.rapidapi.com/search',
            params: {
                query: 'developer jobs in chicago',
                page: '1',
                num_pages: '1',
                country: 'us',
                date_posted: 'all'
            },
            headers: {
                'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_KEY,
                'x-rapidapi-host': 'jsearch.p.rapidapi.com'
            }
        };

        const response = await axios.request<QueryInterface>(options);

        if (response.status !== 200) {
            console.log("Error fetching job postings:", response.status);
            return null;
        }

        return response.data;

    } catch (err) {
        console.error('Error fetching job postings:', err);
        return null;
    }
}

export const getJobDetails = async (jobId: string, country: string) => {

    try {
        const options = {
            method: 'GET',
            url: 'https://jsearch.p.rapidapi.com/job-details',
            params: {
                job_id: jobId,
                country: country || 'us'  // Default to 'us' if no country is provided
            },
            headers: {
                'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_KEY,
                'x-rapidapi-host': 'jsearch.p.rapidapi.com'
            }
        };

        const response = await axios.request(options);
        if (response.status !== 200) {
            console.log("Error fetching job details:", response.status);
            return null;
        }
        return response.data;
    } catch (err) {
        console.log("Server-side issue has occured. Please try again later.");
        return null;
    }
}