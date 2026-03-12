import { Task } from "../models/Task";

//fetch api using promises and error handling
export async function loadTask(): Promise<void> {
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

        const data: unknown = await response.json();
        const tasks: Task[] = data as Task[] ;

        // Display limited fetched data in the console
        const fetchedTasks: Task[] = tasks.slice(0, 10);
        console.log("Fetched API Tasks:", fetchedTasks);
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