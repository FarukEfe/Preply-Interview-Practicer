import axios from 'axios';

/**
 * Analyzes video for filler words, confidence, enthusiasm, and eye contact.
 * @param {string} videoUrl
 * @returns {Promise<Object>} - Metrics JSON
 */
export const analyzeVideoMetrics = async (videoUrl) => {
    const TWELVE_LABS_API_KEY = process.env.TWELVE_LABS_API_KEY;
    if (!TWELVE_LABS_API_KEY) throw new Error('Missing TWELVE_LABS_API_KEY');

    // Example endpoint and payload; adjust to your Twelve Labs API spec
    const endpoint = 'https://api.twelvelabs.io/v1/video/metrics';
    const prompt = `
Return a JSON response with the following metrics for the video:
- number_of_filler_words
- confidence_score (out of 100)
- enthusiasm (out of 100)
- eye_contact (out of 100)
`;

    try {
        const response = await axios.post(
            endpoint,
            {
                video_url: videoUrl,
                prompt
            },
            {
                headers: {
                    'Authorization': `Bearer ${TWELVE_LABS_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching video metrics:', error.response?.data || error.message);
        return null;
    }
};
