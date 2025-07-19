import axios from 'axios';

/**
 * Evaluates interview question-answer accuracy using Gemini AI.
 * @param {Array} questionsToTranscriptMapping
 * @returns {Promise<Array>} - Gemini's evaluation results.
 */
export const evaluateAccuracy = async (questionsToTranscriptMapping) => {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
        throw new Error('Missing GEMINI_API_KEY environment variable. Please set it.');
    }

    const GEMINI_MODEL = 'gemini-2.0-flash'; 
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

    const prompt = `
You are an AI assistant specialized in evaluating conversational accuracy and providing constructive feedback for interview transcripts. Your task is to analyze the user's response to an agent's question within a given conversational segment.

For each question-answer pair, you will:
1.  **Determine an accuracy score (out of 100)**:
    * **100:** The user's response directly and completely answers the agent's question, including all requested information.
    * **70-99:** The user's response largely answers the question but might miss a minor detail, provide slightly more or less information than strictly necessary, or require slight inference.
    * **40-69:** The user's response partially addresses the question, is somewhat ambiguous, or requires significant inference.
    * **0-39:** The user's response is largely irrelevant, contradictory, or clearly indicates a misunderstanding of the question.

2.  **Provide "strengths" (2-3 sentences)**: Describe what the user did well in their response regarding accuracy, clarity, and relevance.

3.  **Provide "needs_improvement" (2-3 sentences)**: Suggest specific areas where the user's response could be enhanced to be more accurate, complete, or clear.

**Input JSON Structure:**
You will receive a JSON object with a key "questions_to_transcript_mapping". This key's value will be a list of objects, each representing a segment of the conversation. Each object will contain:
* \`script_question\`: The original question from the interview script.
* \`transcript_items\`: A list of turn-by-turn dialogue, where the last \`transcript_item\` with \`role: "user"\` is the answer to be evaluated against the \`script_question\` (or the last \`transcript_item\` with \`role: "agent"\` if it's a rephrased question).

**Output JSON Structure:**
Your output must be a JSON array of objects. Each object in the array should correspond to one question-answer pair from the input and contain the following keys:
* \`script_question\`: The original script question.
* \`accuracy_score\`: An integer score out of 100.
* \`strengths\`: A string detailing the strengths of the user's answer.
* \`needs_improvement\`: A string detailing areas for improvement in the user's answer.

Please provide the full JSON input as described above for analysis.
`;

    const inputData = {
        questions_to_transcript_mapping: questionsToTranscriptMapping
    };

    // Combine prompt and input data for Gemini
    const fullPromptContent = prompt + '\n\nInput JSON:\n' + JSON.stringify(inputData, null, 2);

    try {
        const response = await axios.post(
            GEMINI_API_URL, 
            {
                contents: [
                    {
                        parts: [
                            {
                                text: fullPromptContent
                            }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: 0.2, // Lower temperature for more deterministic, factual output
                    maxOutputTokens: 2000, // Increased just in case, adjust as needed
                },
                safetySettings: [
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
                    'X-goog-api-key': GEMINI_API_KEY, // API key in header
                },
            }
        );

        const textResponse = response.data.candidates[0]?.content?.parts[0]?.text || '';

        try {
            return JSON.parse(textResponse);
        } catch (err) {
            console.error('Gemini response was not valid JSON:', textResponse);
            return []; 
        }
    } catch (error) {
        console.error('Error evaluating accuracy with Gemini API:', error.response?.data || error.message);
        return [];
    }
};