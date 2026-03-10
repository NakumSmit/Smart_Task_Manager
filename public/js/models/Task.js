import { validId } from "../utils/helpers.js";

//Task Constructor
export class Task {
    constructor(title, description, priority, status, parentId = null) {
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
    constructor(title, description, status, parentId = null) {
        super(title, description, "high", status, parentId);
        this.important = true;
    }
}