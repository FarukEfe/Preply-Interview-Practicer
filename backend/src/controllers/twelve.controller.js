import { client } from '../lib/twelve_client.js';
// The way the api works is you first create a task, then upload a video and get its id on their database, then create analyze the video on the spot.
// In the mongo Video entity, we'll store the analysis results, twelvelabs video id, and the original video url from ribbon.
import Analysis from '../models/twelve/analysis.model.js';
import TwelveTask from '../models/twelve/task.model.js';
import { evaluateAccuracy } from '../lib/accuracyscore.js';
import { analyzeVideoMetrics } from '../lib/videometrics.js';

// MARK: INDEX (UNUSED)
export const createIndex = async (req, res) => {

    try {
        const { name } = req.body; // Later add the ability to choose a model

        const newIndex = await client.index.create({
            name: `${name}`,
            models: [
                {
                name: "marengo2.7",
                options: ["visual", "audio"],
                },
            ],
            addons: ["thumbnail"],
        });
        
        res.status(200).json({ indexId: newIndex.id, indexName: newIndex.name });
    } catch (err) {
        console.error("Error creating index:", err);
        res.status(500).json({ message: 'Failed to create index.', error: err.message });
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


export const analyzeVideo = async (req, res) => {
    const { videoUrl, questions_to_transcript_mapping } = req.body;
    if (!videoUrl || !questions_to_transcript_mapping) {
        return res.status(400).json({ error: 'Missing videoUrl or questions_to_transcript_mapping' });
    }

    try {
        // Run both analyses in parallel
        const [accuracy, metrics] = await Promise.all([
            evaluateAccuracy(questions_to_transcript_mapping),
            analyzeVideoMetrics(videoUrl)
        ]);
        return res.json({ accuracy, metrics });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
