import axios from 'axios';
import Flow from '../models/ribbon/flow.model.js';
import Interview from '../models/ribbon/interview.model.js';

const options = {
    headers: {
        accept: 'application/json',
        authorization: `Bearer ${process.env.RIBBON_API_KEY}`
    }
};

// Test with the normal url if it works, otherwise set up a proxy as you did in frontend

// MARK: POST
export const createInterview = async (req, res) => {

    const { interviewId, userId } = req.body;

    const url = 'https://app.ribbon.ai/be-api/v1/interviews';

    const data = {
        interview_flow_id: interviewId
    }

    try {
        const result = await axios.post(url, data, options);
        if (result.status !== 200) {
            console.log("Error occured. Status code:", result.status);
            res.status(500).json({ message: 'Failed to create interview. Ribbon call unsuccessful.' });
            return;
        }
        return res.data;
    } catch (err) {
        console.error('Error making interview:', err);
        res.status(500).json({ message: 'Failed to create interview.', error: err.message });
        return;
    }
}

export const createFlow = async (req, res) => {

    const { oname, title, description } = req.body;
    const { userId } = req.query; // api/flows?userId=123

    if (!oname || !title || !description || !userId) {
        res.status(400).json({ message: 'Organization name, title, description, and user ID are required.' });
        return;
    }

    // Request info
    const url = 'https://app.ribbon.ai/be-api/v1/interview-flows';

    // Question is static, this is where you'll generate the list of questions based on job description
    // 'description' is a body parameter from the api POST request
    // just add it here don't worry about the rest of the code
    const questions = ["Why do you work here?"]

    const data = {
        org_name: oname,
        title: title,
        questions: questions,
        is_doc_upload_enabled: false,
        is_phone_call_enabled: false,
        is_video_enabled: true,
    }
    try {
        console.log("hit me lol")
        const result = await axios.post(url, data, options);
        console.log(result.statusText)
        if (result.status !== 200) {
            console.log("Error occured. Status code:", result.status);
            res.status(500).json({ message: 'Failed to create interview flow. Ribbon call unsuccessful.' });
            return;
        }

        if (!result.data.interview_flow_id) {
            console.log("No interview flow ID returned.");
            res.status(500).json({ message: 'Failed to create interview flow. No interview flow ID provided.' });
            return;
        }

        // Save flow to database
        const newFlow = new Flow({
            userId: userId,
            flowId: result.data.interview_flow_id,
            interviews: 0, // Will update this number upon interview creation
        });
        newFlow.save();

        // Send json response
        res.status(201).json({
            message: "Interview flow created successfully.",
            data: result.data,
        });
    } catch (err) {
        console.error('Error making interview flow:', err);
        res.status(500).json({ message: 'Failed to create interview flow.', error: err.message });
        return;
    }
}

// MARK: GET
export const getFlows = async (req, res) => {
    // Get associated flow ids based on user id (mongodb)
    // Fetch associated flow objects (from ribbon) and return in a list
    const url = 'https://app.ribbon.ai/be-api/v1/interview-flows';

    try {
        const { userId } = req.query; // api/flows?userId=123

        if (!userId) {
            res.status(400).json({ message: 'User ID is required.' });
        }
        // Find all flows in mongodb for the user
        const flows = await Flow.find({ userId: userId });

        // Fetch flows from Ribbon API
        const result = await axios.get(url, options);
        if (result.status !== 200) {
            console.log("Error occured. Status code:", result.status);
            res.status(500).json({ message: 'Failed to fetch interview flows. Ribbon call unsuccessful.' });
            return;
        }

        // Filter result list of flows to only include those that match the user's flows
        const userFlows = result.data.interview_flows.filter(flow =>
            flows.some(dbFlow => dbFlow.flowId === flow.interview_flow_id)
        );

        const combinedFlows = userFlows.map(ribbonFlow => {
            const dbFlow = flows.find(dbFlow => dbFlow.flowId === ribbonFlow.interview_flow_id);
            return {
                ...ribbonFlow,
                userId: dbFlow.userId,
                interviews: dbFlow.interviews,
                createdAt: dbFlow.createdAt,
                // flowId: dbFlow.flowId, // Already in ribbonFlow but just in case
            }
        })

        res.status(200).json({
            message: "Interview flows retrieved successfully.",
            data: combinedFlows,
        });

    } catch (err) {
        console.error('Error fetching interview flows:', err);
        return;
    }
}

export const getInterviews = async (req, res) => {
    // Get associated interview ids based on user id (mongodb)
    // Fetch associated flow objects (from ribbon) and return in a list

    const url = 'https://app.ribbon.ai/be-api/v1/interviews';

    try {
        const { userId } = req.query; // api/interviews?userId=123

        if (!userId) {
            res.status(400).json({ message: 'User ID is required.' });
            return;
        }

        const userInterviews = await Interview.find({ userId: userId });
        // Find all interviews in mongodb for the user
        const result = await axios.get(url, options);
        if (result.status !== 200) {
            console.log("Error occured. Status code:", result.status);
            res.status(500).json({ message: 'Failed to fetch interviews. Ribbon call unsuccessful.' });
            return;
        }
        console.log("this happened.")
        // Filter interviews in result.data to only include those in userInterviews
        const interviews = result.data.interviews.filter(interview =>
            userInterviews.some(dbInterview => dbInterview.interviewId === interview.interview_id)
        );

        // Combine the data from Ribbon and MongoDB wherever interview id is a match
        const combinedInterviews = interviews.map(ribbonInterview => {
            const dbInterview = userInterviews.find(dbInterview => dbInterview.interviewId === ribbonInterview.interview_id);
            return {
                ...ribbonInterview,
                userId: dbInterview.userId,
                interviewId: dbInterview.interviewId,
                createdAt: dbInterview.createdAt,
                // interviewId: dbInterview.interviewId, // Already in ribbonInterview but just in case
            }
        });
        
        res.status(200).json({
            message: "Interviews retrieved successfully.",
            data: combinedInterviews,
        });
    } catch (err) {
        console.error('Error fetching data:', err);
        return
    }
}

export const getFlow = async (req, res) => {
    // Get flow by id from ribbon
    try {
        const { flowId, userId } = req.params;
        // Check if userId and flowId is a match in database by looking for one instance
        const flow = await Flow.findOne({ userId: userId, flowId: flowId });
        if (!flow) {
            res.status(404).json({ message: 'Flow not found (user non-authorized to access).' });
        }
        const url = `https://app.ribbon.ai/be-api/v1/interview-flows/${flowId}`;
        const result = await axios.get(url, options);

        if (result.status !== 200) {
            console.log("Error occured. Status code:", result.status);
            res.status(500).json({ message: 'Failed to fetch flow. Ribbon call unsuccessful.' });
            return;
        }

        res.status(200).json({
            message: "Flow retrieved successfully.",
            data: result.data,
        });
    } catch (err) {
        console.error('Error fetching flow:', err);
        res.status(500).json({ message: 'Failed to fetch flow.', error: err.message });
    }
}

export const getInterview = async (req, res) => {
    // Get interview by id from ribbon
    try {
        const { interviewId, userId } = req.params;
        // Check if userId and interviewId is a match in database by looking for one instance
        const interview = await Interview.findOne({ userId: userId, interviewId: interviewId });
        if (!interview) {
            res.status(404).json({ message: 'Interview not found (user non-authorized to access).' });
            return;
        }
        
        const url = `https://app.ribbon.ai/be-api/v1/interviews/${interviewId}`;
        const result = await axios.get(url, options);

        if (result.status !== 200) {
            console.log("Error occured. Status code:", result.status);
            res.status(500).json({ message: 'Failed to fetch interview. Ribbon call unsuccessful.' });
            return;
        }

        res.status(200).json({
            message: "Interview retrieved successfully.",
            data: result.data,
        });
    } catch (err) {
        console.error('Error fetching interview:', err);
        res.status(500).json({ message: 'Failed to fetch interview.', error: err.message });
    }
}