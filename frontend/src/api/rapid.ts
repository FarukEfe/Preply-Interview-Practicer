import axios from 'axios';

// Populate the QueryInterface and use it as query filter input to getJobsFilter

export const QueryInterface = {

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

        const response = await axios.request(options);

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