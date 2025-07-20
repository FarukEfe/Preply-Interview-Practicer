import { client } from '../lib/twelve_client.js';
// The way the api works is you first create a task, then upload a video and get its id on their database, then create analyze the video on the spot.
// In the mongo Video entity, we'll store the analysis results, twelvelabs video id, and the original video url from ribbon.
import Analysis from '../models/twelve/analysis.model.js';
import TwelveTask from '../models/twelve/task.model.js';

// MARK: INDEX (UNUSED)
// Update your twelve.controller.js
export const createIndex = async (req, res) => {
    try {
        const { indexName } = req.body;

        if (!indexName) {
            return res.status(400).json({ message: "Index name is required." });
        }

        // Create index with pegasus engine for analysis support
        const index = await client.index.create({
            name: indexName,
            engines: [
                {
                    name: "pegasus1.1",
                    options: ["visual", "conversation", "text_in_video"]
                }
            ]
        });

        if (!index || !index.id) {
            return res.status(500).json({ message: 'Failed to create index.' });
        }

        res.status(200).json({
            message: "Index created successfully with analysis support.",
            indexId: index.id,
        });

    } catch (err) {
        console.error("Failed to create index:", err);
        res.status(500).json({
            message: "Failed to create index.",
            error: err.message,
        });
    }
};
// Update the checkIndexSupport function
export const checkIndexSupport = async (req, res) => {
    try {
        const { indexId } = req.params;

        const index = await client.index.retrieve(indexId);
        
        console.log("Full index object:", JSON.stringify(index, null, 2));
        
        // Check different possible structures
        let supportsGenerate = false;
        let engines = [];
        
        if (index.engines && Array.isArray(index.engines)) {
            engines = index.engines;
            supportsGenerate = index.engines.some(engine => 
                engine.name && engine.name.includes('pegasus')
            );
        } else if (index.models && Array.isArray(index.models)) {
            engines = index.models;
            supportsGenerate = index.models.some(model => 
                model.name && model.name.includes('pegasus')
            );
        } else {
            engines = ["Unknown structure"];
            supportsGenerate = false;
        }

        res.status(200).json({
            indexId: indexId,
            supportsGenerate: supportsGenerate,
            engines: engines,
            fullIndexObject: index,
            recommendation: supportsGenerate ? 
                "This index supports analysis" : 
                "Create a new index with pegasus engine for analysis support"
        });

    } catch (err) {
        console.error("Failed to check index:", err);
        res.status(500).json({
            message: "Failed to check index",
            error: err.message
        });
    }
};
export const getIndex = async (req, res) => {
    try {
        const { indexId } = req.query;

        if (!indexId) {
            res.status(400).json({ message: 'Index ID is required.' });
            return;
        }

        const index = await client.index.retrieve(indexId);

        if (!index) {
            res.status(404).json({ message: 'Index not found.' });
            return;
        }

        
        res.status(200).json({
            message: 'Index retrieved successfully.',
            duration: index.totalDuration,
            name: index.name,
        });
    } catch (err) {
        console.error("Error retrieving index:", err);
        res.status(500).json({ message: 'Failed to retrieve index.', error: err.message });
    }
}

// MARK: TASK
export const getTasks = async (req, res) => {
    try {
        // Get user id from query params
        const { userId } = req.query;

        // Get all task objects for that user id
        // console.log(userId);
        const tasks = await TwelveTask.find({ userId: userId });
        // using task id from each object get the task from twelve labs
        const taskDetails = await Promise.all(tasks.map(async (task) => {
            
            const taskData = await client.task.retrieve(task.taskId);
            
            return{
                id: taskData.id,
                status: taskData.status,
                videoId: taskData.videoId,
                createdAt: taskData.createdAt,
                updatedAt: taskData.updatedAt,
                indexId: taskData.indexId,
                videoUrl: task.videoUrl, // Add the video URL from the database
            };
        }));

        // Send results to user
        res.status(200).json({
            message: "Tasks retrieved successfully.",
            tasks: taskDetails,
        });

    } catch (err) {
        console.error("Error retrieving tasks:", err);
        res.status(500).json({ message: 'Failed to retrieve tasks.', error: err.message });
    }


}

export const createTask = async (req, res) => {

    try {
        const { videoUrl, indexId, userId } = req.body;

        console.log(videoUrl)

        if (!videoUrl || !indexId || !userId) {
            res.status(400).json({ message: "Missing required fields: videoUrl, indexId, or userId." });
            return;
        }

        console.log(videoUrl, indexId, userId);
        
        const task = await client.task.create({
            indexId: indexId,
            url: videoUrl,
        })
        
        // Save the task to the database with userid link
        const newTask = new TwelveTask({
            taskId: task.id,
            userId: userId,
            videoUrl: videoUrl,
        });
        const _ = await newTask.save();
        
        // Respond to client
        res.status(200).json({
            message: "Task created successfully",
            taskId: task.id,
            videoId: task.videoId,
        });
    } catch (err) {
        console.log("Failed to create task due to server side error.", err)
        res.status(500).json({
            message: "Failed to create task.",
            error: err.message,
        });
    }
}
// Update your analyzeVideo function in twelve.controller.js
export const analyzeVideo = async (req, res) => {
    try {
        const { taskId } = req.body;

        console.log("=== ANALYSIS REQUEST START ===");
        console.log("TaskId:", taskId);

        if (!taskId) {
            return res.status(400).json({ message: 'TaskId is required.' });
        }

        // Get the task
        const task = await client.task.retrieve(taskId);
        console.log("Task details:", {
            id: task.id,
            status: task.status,
            videoId: task.videoId,
            indexId: task.indexId
        });

        if (task.status !== 'ready' || !task.videoId) {
            return res.status(400).json({ 
                message: 'Task is not ready yet.',
                status: task.status,
                videoId: task.videoId 
            });
        }

        console.log("=== TRYING API CALLS ===");

        // Simple prompt for testing
        const prompt = "Analyze this video and provide a confidence score from 1 to 100.";
        console.log("Using simple prompt:", prompt);

        let result = null;
        let methodUsed = null;

        // Method 1: Basic generate.summarize
        try {
            console.log("Method 1: Basic generate.summarize");
            result = await client.generate.summarize(task.videoId, prompt);
            methodUsed = "generate.summarize (basic)";
            console.log("Method 1 SUCCESS");
        } catch (error1) {
            console.log("Method 1 FAILED:", error1.message);
            
            // Method 2: generate.summarize with options
            try {
                console.log("Method 2: generate.summarize with options");
                result = await client.generate.summarize(task.videoId, {
                    prompt: prompt
                });
                methodUsed = "generate.summarize (with options)";
                console.log("Method 2 SUCCESS");
            } catch (error2) {
                console.log("Method 2 FAILED:", error2.message);
                
                // Method 3: generate.text (if available)
                try {
                    console.log("Method 3: generate.text");
                    result = await client.generate.text(task.videoId, prompt);
                    methodUsed = "generate.text";
                    console.log("Method 3 SUCCESS");
                } catch (error3) {
                    console.log("Method 3 FAILED:", error3.message);
                    
                    // Method 4: Direct video query
                    try {
                        console.log("Method 4: Direct video query");
                        result = await client.video.query(task.videoId, prompt);
                        methodUsed = "video.query";
                        console.log("Method 4 SUCCESS");
                    } catch (error4) {
                        console.log("Method 4 FAILED:", error4.message);
                        
                        // All methods failed
                        console.log("=== ALL METHODS FAILED ===");
                        return res.status(500).json({
                            message: "All API methods failed",
                            errors: {
                                method1: error1.message,
                                method2: error2.message,
                                method3: error3.message,
                                method4: error4.message
                            }
                        });
                    }
                }
            }
        }

        console.log("=== SUCCESS ===");
        console.log("Method used:", methodUsed);
        console.log("Result:", result);

        // Handle the response
        let analysisData = result?.data || result?.text || result;

        const twelveTask = await TwelveTask.findOne({ taskId: taskId });
        
        const analysis = new Analysis({
            taskId: taskId,
            videoId: task.videoId,
            videoUrl: twelveTask?.videoUrl,
            userId: twelveTask?.userId,
            analysisResults: analysisData
        });
        
        await analysis.save();
        
        res.status(200).json({
            message: 'Video analyzed successfully.',
            analysis: analysisData,
            methodUsed: methodUsed,
            taskId: taskId,
            videoId: task.videoId
        });

    } catch (err) {
        console.error("=== OUTER ERROR ===");
        console.error("Error:", err);
        console.error("Error message:", err.message);
        console.error("Error response:", err.response?.data);
        
        res.status(500).json({ 
            message: 'Failed to analyze video.',
            error: err.message,
            details: err.response?.data || 'No additional details'
        });
    }
}