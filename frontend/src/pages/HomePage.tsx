import { useState, useEffect } from "react"
import { authStore } from "../lib/authStore";
import { analyzeVideo, getTasks } from "../api/twelve";
import { TaskProcessItem } from "./TaskItem";

export interface Task {
  createdAt: string;
  id: string;
  indexId: string;
  status: string;
  updatedAt: string;
  videoId: string;
  videoUrl: string;
}

const HomePage = () => {

  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        getTasks(authStore.getState().authUser?._id).then(response => {
          if (response) {
            console.log("Fetched tasks:", response.tasks);
            setTasks(response.tasks);
          } else {
            console.error("Failed to fetch tasks");
          }
        });

      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  useEffect(() => { console.log(tasks); }, [tasks]);

  useEffect(() => { console.log(analysis), [analysis] })

  return (
    <>
      {tasks ? (
        tasks.map((task) => {
          return <TaskProcessItem task={task} analyzeVideo={() => {
            console.log("Analyzing video for task:", task.id);
            // Implement video analysis logic here
            analyzeVideo(task.id).then(response => {
              if (response) {
                console.log("Video analyzed successfully:", response);
                setAnalysis(response);
              } else {
                console.error("Failed to analyze video for task:", task.id);
              }
            }).catch(error => {
              console.error("Error analyzing video:", error);
            });
          }} />
        })
      ) : null}
    </>
  )
}

export default HomePage;