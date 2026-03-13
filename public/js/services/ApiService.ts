import { Task } from "../models/Task";

//fetch api using promises and error handling
export async function loadTask(): Promise<Task[] | void> {
    const loadingState: HTMLElement | null = document.getElementById("loading-state");
    if (loadingState) {//loading state starts
        loadingState.style.display = "flex";
    }

    try {
        const response: Response = await fetch("https://jsonplaceholder.typicode.com/todos");
        await new Promise<void>((resolve: () => void) => setTimeout(resolve, 2000));

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        const data: any[] = await response.json();
        
        // Map raw API data to our Task prototype instances
        const apiTasks: Task[] = data.map(item => {
            return new (Task as any)(
                item.title,
                "Imported from API", // mock description
                "low", // default priority
                item.completed ? "completed" : "pending",
                null // top level tasks
            );
        });

        // Limit the fetched data returned
        const fetchedTasks: Task[] = apiTasks.slice(0, 10);
        return fetchedTasks;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error in fetching:", error.message);
        } else {
            console.error("Unknown error:", error);
        }
    } finally {//loading state ends
        if (loadingState) {
            loadingState.style.display = "none";
        }
    }
}