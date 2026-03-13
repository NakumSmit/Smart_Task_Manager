import { Task } from "../models/Task";

export function renderTasks(tasksToRender: Task[]): void {
    const taskList = document.getElementById("tasks") as HTMLTableSectionElement | null;
    if (!taskList) return; // Clear existing
    taskList.innerHTML = "";

    // In search mode, we might just have scattered tasks. 
    // To maintain tree structure, let's only start the tree from tasks that have no parent *within* the tasksToRender list
    const rootTasks = tasksToRender.filter(t => !tasksToRender.some(p => String(p.id) === String(t.parentId)));

    function renderTaskTree(task: Task, level: number) {
        taskList!.appendChild(createTaskRow(task, level));

        // Render subtasks that are also in our tasksToRender list
        const mySubtasks = tasksToRender.filter(t => String(t.parentId) === String(task.id));
        mySubtasks.forEach(subTask => renderTaskTree(subTask, level + 1));
    }

    rootTasks.forEach(mainTask => {
        renderTaskTree(mainTask, 0);
    });
}

//Create Task Row
function createTaskRow(task: Task, level: number = 0): HTMLTableRowElement {
    const importantIcon: string = task.important ? "🔥 " : "";
    const tr: HTMLTableRowElement = document.createElement("tr");
    tr.dataset.id = (task.id).toString();

    if (task.status === "completed") {
        tr.classList.add("completed");
    }

    if (level > 0) {
        tr.classList.add("subtask-row");
    }

    //Increment number for subtask
    let subtaskNumber = 1;
    if (level > 0) {
        subtaskNumber = level + 1;
    }


    let indent = "";
    if (level > 0) {
        indent = `<span class="ps-4" style="margin-left: ${level * 20}px;">${subtaskNumber}. </span>`;
    }

    //Dislay title by importance
    const titleDisplay: string = `${indent}${importantIcon}${task.title}`;

    //Make the row for display task
    tr.innerHTML = `
    <td>${titleDisplay}</td>
    <td>${task.id}</td>
    <td style="width: 25%;">${task.description}</td>
    <td><span class="badge ${task.priority === 'high'
            ? 'bg-danger'
            : task.priority === 'medium'
                ? 'bg-warning text-dark'
                : 'bg-success'}">${task.priority}</span></td>
    <td>${task.createdAt}</td>
    <td><span class="badge ${task.status === 'completed' ? 'bg-success' : 'bg-secondary'} statusText">${task.status}</span></td>
    <td>
        <div class="action-btns">
            <button class="btn btn-success btn-sm task-complete-btn" ${task.status === "completed" ? "disabled" : ""}>Completed</button>
            <button class="btn btn-danger btn-sm task-delete-btn">Delete</button>
            <button class="btn btn-primary btn-sm task-subtask-btn" data-bs-toggle="modal" data-bs-target="#inputModal">Add SubTask</button>
        </div>
    </td>
`;
    return tr;
}