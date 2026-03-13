import { Task } from "../models/Task";

export function renderTasks(allTasks: Task[]): void {
    const taskList = document.getElementById("tasks") as HTMLTableSectionElement | null;
    if (!taskList) return; // Clear existing
    taskList.innerHTML = "";

    //Find root tasks
    const rootTasks: Task[] = allTasks.filter(t => !allTasks.some(p => String(p.id) === String(t.parentId)));

    //Make the child tasks appear below their parent
    function renderTaskTree(task: Task, level: number) {
        taskList!.appendChild(createTaskRow(task, level));

        // Render subtasks that are also in our tasks list
        const mySubtasks = allTasks.filter(t => String(t.parentId) === String(task.id));
        mySubtasks.forEach((subTask: Task) => renderTaskTree(subTask, level + 1));
    }

    rootTasks.forEach((mainTask: Task) => {
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

    let space = "";
    if (level > 0) {
        space = `<span class="ps-4" style="margin-left: ${level * 10}px;">${level + 1}. </span>`;
    }

    //Dislay title by importance
    const titleDisplay: string = `${space}${importantIcon}${task.title}`;

    //Make the row for display task
    tr.innerHTML = `
    <td>${titleDisplay}</td>
    <td>${task.id}</td>
    <td style="width: 25%;">${task.description}</td>
    <td><span class="badge ${task.priority === 'high'
            ? 'bg-danger'
            : task.priority === 'medium'
                ? 'bg-warning text-dark'
                : 'bg-success'}">${task.priority}
        </span>
    </td>
    <td>${task.createdAt}</td>
    <td><span class="badge ${task.status === 'completed' 
        ? 'bg-success' : 'bg-secondary'} 
        statusText">${task.status}
        </span>
    </td>
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