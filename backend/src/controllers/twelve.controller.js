import { client } from '../lib/twelve_client.js';
// The way the api works is you first create a task, then upload a video and get its id on their database, then create analyze the video on the spot.
// In the mongo Video entity, we'll store the analysis results, twelvelabs video id, and the original video url from ribbon.
import Analysis from '../models/twelve/analysis.model.js';
import TwelveTask from '../models/twelve/task.model.js';

// MARK: INDEX (UNUSED)
export const createIndex = async (req, res) => {

    try {
        const { name } = req.body; // Later add the ability to choose a model

        const newIndex = await client.index.create({
            name: `${name}`,
            models: [
                {
                    name: "marengo2.6",  // For video understanding
                    options: ["visual", "conversation", "text_in_video"]
                },
                {
                    name: "pegasus1",    // For generation/summarization
                    options: ["visual", "conversation"]
                }
            ],
            addons: ["thumbnail"],
        });
        
        res.status(200).json({ indexId: newIndex.id, indexName: newIndex.name });
    } catch (err) {
        console.error("Error creating index:", err);
        res.status(500).json({ message: 'Failed to create index.', error: err.message });
    }
}

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

// MARK: ANALYZE VIDEO
export const analyzeVideo = async (req, res) => {
    try {
        const { taskId } = req.body;

        const task = await client.task.retrieve(taskId);

        if (task.status !== 'ready' || !task.videoId) {
            res.status(400).json({ message: 'Task is not prepared yet.' });
            return;
        }

        console.log(task);
        // Use task to analyze the video
        const prompt = "Return a json format with the following key names: confidence, enthusiasm, positivity, and summary. Confidence, enthusiasm, and positivity are going to be a score from 0 to 100 based on the persons attitude in the video. Summary is going to be a list of descriptions of major timestamps in the video."
        const result = await client.summarize(task.videoId, "summary", prompt, 0.5)
        if (!result || !result.data) {
            res.status(404).json({ message: 'Failed to analyze video, maybe try later.' });
            return;
        }
        // Find the task object in mongoose with id
        const twelveTask = await TwelveTask.findOne({ taskId: taskId });
        
        // Save video analysis
        const analysis = new Analysis({
            taskId: taskId,
            videoId: task.videoId,
            videoUrl: twelveTask.videoUrl,
            userId: twelveTask.userId,
            analysisResults: result
        })
        const _ = await analysis.save();

        res.status(200).json({
            message: 'Video analyzed successfully.',
            analysis: result,
        });

    } catch (err) {
        console.error("Error analyzing video:", err);
        res.status(500).json({ message: 'Failed to analyze video.' });
    }
}