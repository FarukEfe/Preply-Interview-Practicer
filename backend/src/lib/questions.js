import axios from 'axios';

/**
 * Sends a job description to Gemini AI and returns 5 interview questions (mix of hard and soft skills).
 * @param {string} desc - The job description.
 * @returns {Promise<string[]>} - Array of 5 questions.
 */
export const desc_to_questions = async (desc) => {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
        throw new Error('Missing GEMINI_API_KEY environment variable');
    }

    const GEMINI_API_URL = 'https://api.gemini.ai/v1/generate';

    const prompt = `
Given the following job description, generate 5 interview questions that assess both hard and soft skills relevant to the role. 
Return only the questions as a numbered list.

Job Description:
${desc}
`;

    try {
        const response = await axios.post(
            GEMINI_API_URL,
            {
                prompt: prompt,
                max_tokens: 300,
                n: 1,
            },
            {
                headers: {
                    'Authorization': `Bearer ${GEMINI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const text = response.data.choices[0].text || '';
        const questions = text
            .split('\n')
            .map(line => line.replace(/^\d+\.\s*/, '').trim())
            .filter(line => line.length > 0);

        return questions.slice(0, 5);
    } catch (error) {
        console.error('Error generating interview questions:', error.message);
        return [
            'Could not generate questions at this time.'
        ];
    }
};
