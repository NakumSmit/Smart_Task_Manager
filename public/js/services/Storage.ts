import { Task } from "../models/Task.ts";

//Get Tasks from Local Storage
export function getTasks(): Task[] | null {
    const tasks = localStorage.getItem("tasks");
    return tasks ? JSON.parse(tasks) : [];
}

//Save Tasks to Local Storage
export function saveTasks(tasks: Task[]) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
