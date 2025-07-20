import { useState, useEffect } from "react"
import { authStore } from "../lib/authStore";
import { getTasks } from "../api/twelve";

interface Task {
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

  return (
    <>
      <div>HomePage</div>
      <div>
        PLZ IMPLEMENT KUUL VISUALS!!!
      </div>
    </>
  )
}

export default HomePage;