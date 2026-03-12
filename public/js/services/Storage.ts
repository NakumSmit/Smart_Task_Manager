import { Task } from "../models/Task";

//Get Tasks from Local Storage
export function getTasks(): Task[] | null {
    const tasks: string | null = localStorage.getItem("tasks");
    if (!tasks) return null;
    return JSON.parse(tasks) as Task[];
}

//Save Tasks to Local Storage
export function saveTasks(tasks: Task[]): void {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}