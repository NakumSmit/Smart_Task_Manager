import { validId } from "../utils/helpers.ts";

type Priority = "high" | "medium" | "low";
type Status = "pending" | "completed";

//Task Constructor
export class Task {
    id: string;
    title: string;
    description: string;
    priority: Priority;
    status: Status;
    parentId: string | null;
    createdAt: string;
    important?: boolean;
    constructor(
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
}

//Task Constructor Inheritance
export class ImportantTask extends Task {
    important: boolean;
    constructor(
        title: string,
        description: string,
        status: Status,
        parentId: string | null = null
    ) {
        super(title, description, "high", status, parentId);
        this.important = true;
    }
}