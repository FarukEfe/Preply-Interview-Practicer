import axios from 'axios';

/**
 * Sends a job description to Gemini AI and returns 5 interview questions (mix of hard and soft skills).
 * @param {string} desc - The job description.
 * @returns {Promise<string[]>} - Array of 5 questions.
 */
export const desc_to_questions = async (desc) => {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
        throw new Error('Missing GEMINI_API_KEY environment variable. Please set it.');
    }

    // Recommended model for text generation tasks
    const GEMINI_MODEL = 'gemini-pro';
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

    const prompt = `
Given the following job description, generate 5 interview questions that assess both hard and soft skills relevant to the role.
Return only the questions as a numbered list. Ensure each question is on a new line.

Job Description:
${desc}
`;

    try {
        const response = await axios.post(
            GEMINI_API_URL,
            {
                // Correct request body structure for Gemini API
                contents: [
                    {
                        parts: [
                            {
                                text: prompt
                            }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: 0.7, 
                    maxOutputTokens: 500, 
                    // topP: 0.95,
                    // topK: 40,
                },
                safetySettings: [ // Important to include or disable as per your app's needs
                    {
                        category: "HARM_CATEGORY_HARASSMENT",
                        threshold: "BLOCK_NONE",
                    },
                    {
                        category: "HARM_CATEGORY_HATE_SPEECH",
                        threshold: "BLOCK_NONE",
                    },
                    {
                        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                        threshold: "BLOCK_NONE",
                    },
                    {
                        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                        threshold: "BLOCK_NONE",
                    },
                ],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-goog-api-key': GEMINI_API_KEY, // Correct API key header
                },
            }
        );

        // Correctly parse the response from Gemini's nested structure
        const text = response.data.candidates[0]?.content?.parts[0]?.text || '';

        // Split by newline and clean up numbering/whitespace
        const questions = text
            .split('\n')
            .map(line => line.replace(/^\s*\d+\.\s*/, '').trim()) // Handles "1. Question" and "1.Question"
            .filter(line => line.length > 0); // Remove empty lines

        return questions.slice(0, 5); // Ensure only up to 5 questions are returned
    } catch (error) {
        // More robust error logging
        console.error('Error generating interview questions:', error.response?.data || error.message);
        return [
            'Could not generate questions at this time. Please check the API key and network connection.'
        ];
    }
};