//Get Tasks from Local Storage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

//Add Task to the Table
const taskForm = document.getElementById("task-form");

taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!taskForm.checkValidity()) {
        event.stopPropagation();
        taskForm.classList.add('was-validated');
        return;
    }

    const taskTitle = document.getElementById("taskTitle").value;
    const taskDescription = document.getElementById("taskDescription").value;
    const taskPriority = document.querySelector('input[name="taskPriority"]:checked').value;
    const taskStatus = document.querySelector('input[name="status"]:checked').value;

    const task = {
        title: taskTitle,
        description: taskDescription,
        priority: taskPriority,
        id: validId(),
        status: taskStatus,
        createdAt: new Date().toLocaleString()
    };

    tasks.push(task);
    saveTasks();
    renderTasks();

    // Reset the form after submitting
    taskForm.reset();
    taskForm.classList.remove('was-validated');
});

// Clear validation messages on reset
taskForm.addEventListener("reset", function () {
    taskForm.classList.remove('was-validated');
});

// State Management
let currentParentId = null;

function validId() {
    return Math.random().toString(36).substring(2, 10);
}

function prepareSubTask(button) {
    const tr = button.closest("tr");
    if (tr) {
        currentParentId = tr.dataset.id;
    }
}

//Render All Tasks
function renderTasks() {
    const taskList = document.getElementById("tasks");
    taskList.innerHTML = ""; // Clear existing

    // 1. Filter out subtasks (they have a parentId)
    const mainTasks = tasks.filter(t => !t.parentId);

    // 2. Render each main task, and then immediately render its subtasks
    mainTasks.forEach(mainTask => {
        taskList.appendChild(createTaskRow(mainTask, false));

        const mySubtasks = tasks.filter(t => t.parentId === mainTask.id);
        mySubtasks.forEach(subTask => {
            taskList.appendChild(createTaskRow(subTask, true));
        });
    });
}

function createTaskRow(task, isSubtask = false) {
    const tr = document.createElement("tr");
    tr.dataset.id = task.id;

    if (task.status === "completed") {
        tr.classList.add("completed");
    }

    if (isSubtask) {
        tr.classList.add("subtask-row");
    }

    const titleDisplay = isSubtask ? `<span class="ps-4">--> ${task.title}</span>` : task.title;

    // Disable Add SubTask button for subtasks to prevent infinite nesting
    const addSubTaskButton = isSubtask ? "" : `<button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#inputModal" onclick="prepareSubTask(this)">Add SubTask</button>`;

    tr.innerHTML = `
        <td>${titleDisplay}</td>
        <td>${task.id}</td>
        <td style="width: 25%;">${task.description}</td>
        <td><span class="badge ${task.priority === 'high' ? 'bg-danger' : task.priority === 'medium' ? 'bg-warning text-dark' : 'bg-success'}">${task.priority}</span></td>
        <td>${task.createdAt}</td>
        <td><span class="badge ${task.status === 'completed' ? 'bg-success' : 'bg-secondary'} statusText">${task.status}</span></td>
        <td>
            <button class="btn btn-danger btn-sm mb-1" onclick="deleteTask(this)">Delete</button>
            <button class="btn btn-success btn-sm mb-1" onclick="completeTask(this)" ${task.status === "completed" ? "disabled" : ""}>Completed</button>
            ${addSubTaskButton}
        </td>
    `;
    return tr;
}

//Delete Task from the Table
function deleteTask(button) {
    const tr = button.closest("tr");
    if (tr) {
        const id = tr.dataset.id;
        // Also remove any subtasks that belong to this task
        tasks = tasks.filter(t => String(t.id) !== String(id) && String(t.parentId) !== String(id));
        saveTasks();
        renderTasks(); // Re-render to show changes
    }
}

//Mark Completed on click of the button
function completeTask(button) {
    const tr = button.closest("tr");
    if (tr) {
        const id = tr.dataset.id;
        const task = tasks.find(t => String(t.id) === String(id));
        if (task) {
            task.status = "completed";
            saveTasks();

            // Update the status badge in the table
            const statusBadge = tr.querySelector(".statusText");
            if (statusBadge) {
                statusBadge.textContent = "completed";
                statusBadge.classList.replace("bg-secondary", "bg-success");
            }
        }

        tr.classList.add("completed");
        button.disabled = true;
    }
}

//Load Tasks from Local Storage
window.onload = function () {
    renderTasks();
}

//Save Tasks to Local Storage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

//Search Task with debounce function
function debounce(func, delay) {
    let timeout;
    return function (...args) {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
            func.apply(this, args);
            timeout = null;
        }, delay);
    };
}

//Search Task
function performSearch() {
    const query = document.getElementById("search").value.toLowerCase();
    const rows = document.querySelectorAll("#tasks tr");

    rows.forEach(row => {
        const title = row.cells[0] ? row.cells[0].textContent.toLowerCase() : "";

        if (title.includes(query)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}
//Attach the search task function with debounce
const searchTask = debounce(performSearch, 300);

//Scroll Logging with throttle function
function throttle(func, delay) {
    let timeout = null;
    return function (...args) {
        if (timeout) {
            return;
        }
        timeout = setTimeout(() => {
            func.apply(this, args);
            timeout = null;
        }, delay);
    }
}

// Attach the scroll logging function to the scroll event with a throttle
window.addEventListener("scroll", throttle(function () { }, 300));

//Sub task
const subTaskForm = document.getElementById("subTask-form");
// Changed from submit ID to avoid conflicts, form submit event handles it
const submitBtn = document.getElementById("submit");

// Make sure that the manual submit button triggers form submission
if (submitBtn) {
    submitBtn.addEventListener("click", () => subTaskForm.requestSubmit());
}

subTaskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!subTaskForm.checkValidity()) {
        event.stopPropagation();
        subTaskForm.classList.add('was-validated');
        return;
    }

    const taskTitle = document.getElementById("subTask-title").value;
    const taskDescription = document.getElementById("subTask-description").value;
    const taskPriority = document.querySelector('input[name="subTaskPriority"]:checked').value;
    const taskStatus = document.querySelector('input[name="subTaskStatus"]:checked').value;

    const task = {
        title: taskTitle,
        description: taskDescription,
        priority: taskPriority,
        id: validId(),
        status: taskStatus,
        parentId: currentParentId, // Link to parent
        createdAt: new Date().toLocaleString()
    };

    tasks.push(task);
    saveTasks();
    renderTasks(); // Re-render everything to show subtask in correct position

    // Reset the form after submitting
    subTaskForm.reset();
    subTaskForm.classList.remove('was-validated');

    // Hide modal
    const modalElement = document.getElementById('inputModal');
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) {
        modal.hide();
    }

    currentParentId = null; // Reset
});

// Clear validation messages on reset
subTaskForm.addEventListener("reset", function () {
    subTaskForm.classList.remove('was-validated');
});