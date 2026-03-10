export function renderTasks(tasks) {
    const taskList = document.getElementById("tasks");
    if (!taskList) return; // Clear existing
    taskList.innerHTML = "";

    //Filter out subtasks (they have a parentId)
    const mainTasks = tasks.filter(t => !t.parentId);

    //Render each main task, and then immediately render its subtasks
    mainTasks.forEach(mainTask => {
        taskList.appendChild(createTaskRow(mainTask, false));

        const mySubtasks = tasks.filter(t => t.parentId === mainTask.id);
        mySubtasks.forEach(subTask => {
            taskList.appendChild(createTaskRow(subTask, true));
        });
    });
}

//Create Task Row
function createTaskRow(task, isSubtask = false) {
    const importantIcon = task.important ? "🔥 " : "";
    const tr = document.createElement("tr");
    tr.dataset.id = task.id;

    if (task.status === "completed") {
        tr.classList.add("completed");
    }

    if (isSubtask) {
        tr.classList.add("subtask-row");
    }

    //Dislay title by importance
    const titleDisplay = isSubtask ? `<span class="ps-4">--> ${importantIcon}${task.title}</span>` : `${importantIcon}${task.title}`;

    //Make the row for display task
    tr.innerHTML = `
    <td>${titleDisplay}</td>
    <td>${task.id}</td>
    <td style="width: 25%;">${task.description}</td>
    <td><span class="badge ${task.priority === 'high' ? 'bg-danger' : task.priority === 'medium' ? 'bg-warning text-dark' : 'bg-success'}">${task.priority}</span></td>
    <td>${task.createdAt}</td>
    <td><span class="badge ${task.status === 'completed' ? 'bg-success' : 'bg-secondary'} statusText">${task.status}</span></td>
    <td>
        <div class="action-btns">
            <button class="btn btn-success btn-sm" onclick="completeTask(this)" ${task.status === "completed" ? "disabled" : ""}>Completed</button>
            <button class="btn btn-danger btn-sm" onclick="deleteTask(this)">Delete</button>
            ${isSubtask ? "" : `<button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#inputModal" onclick="prepareSubTask(this)">Add SubTask</button>`}
        </div>
    </td>
`;
    return tr;
}
