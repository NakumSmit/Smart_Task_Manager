import { validId } from "../utils/helpers";

export type Priority = "high" | "medium" | "low";
export type Status = "pending" | "completed";

// Task Constructor function
export function Task(
    this: any,
    title: string,
    description: string, 
    priority: Priority,
    status: Status,
    parentId: string | null = null
) {
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.status = status;
    this.parentId = parentId;
    this.id = validId();
    this.createdAt = new Date().toLocaleString();
}

// Ensure TypeScript knows it can be instantiated
export interface Task {
    id: string;
    title: string;
    description: string;
    priority: Priority;
    status: Status;
    parentId: string | null;
    createdAt: string;
    important?: boolean;
}

// ImportantTask Constructor Inheritance
export function ImportantTask(
    this: any,
    title: string,
    description: string,
    status: Status,
    parentId: string | null = null
) {
    Task.call(this, title, description, "high", status, parentId);
    this.important = true;
}

//prototype inheritance in ImportantTask through Task
ImportantTask.prototype = Object.create(Task.prototype);
ImportantTask.prototype.constructor = ImportantTask;

export interface ImportantTask extends Task {
    important: boolean;
}