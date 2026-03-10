import { Task, ImportantTask } from "./models/Task.js";
import { getTasks, saveTasks } from "./services/Storage.js";
import { loadTask } from "./services/ApiService.js";
import { renderTasks } from "./ui/Renderer.js";
import { debounce, throttle } from "./utils/helpers.js";

//Get Tasks from Local Storage
let tasks = getTasks();

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

    const task = taskPriority === "high"
        ? new ImportantTask(taskTitle, taskDescription, taskStatus)
        : new Task(taskTitle, taskDescription, taskPriority, taskStatus);

    tasks.push(task);
    saveTasks(tasks);
    renderTasks(tasks);

    // Reset the form after submitting
    taskForm.reset();
    taskForm.classList.remove('was-validated');
});

let currentParentId = null;

//Add SubTask
function prepareSubTask(button) {
    const tr = button.closest("tr");
    if (tr) {
        currentParentId = tr.dataset.id;
    }
}

//Delete Task from the Table
function deleteTask(button) {
    const tr = button.closest("tr");
    if (tr) {
        const id = tr.dataset.id;
        // Also remove any subtasks that belong to this task
        tasks = tasks.filter(t => String(t.id) !== String(id) && String(t.parentId) !== String(id));
        saveTasks(tasks);
        renderTasks(tasks); // Re-render to show changes
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
            saveTasks(tasks);

            // Update the status badge in the table
            const statusBadge = tr.querySelector(".statusText");
            if (statusBadge) {
                statusBadge.textContent = "completed";
                statusBadge.classList.replace("bg-secondary", "bg-success");
            }
        }

        tr.classList.add("completed");
        button.disabled = true;//Button will be disabled after completion
    }
}

//Load Tasks from local storage and API
window.onload = async function () {
    renderTasks(tasks);
    await loadTask(); // Automatically fetch data without a button
}

//Search Task
function performSearch() {
    const query = document.getElementById("search").value.toLowerCase();
    const rows = document.querySelectorAll("#tasks tr");

    rows.forEach(row => {
        const title = row.cells[0] ? row.cells[0].textContent.toLowerCase() : "";

        row.style.display = title.includes(query) ? "" : "none";
    });
}
//Attach the search task function with debounce
const searchTask = debounce(performSearch, 300);

// Attach the scroll logging function to the scroll event with a throttle
window.addEventListener("scroll", throttle(function () { console.log("Scrolled") }, 500));

//Sub task
const subTaskForm = document.getElementById("subTask-form");
// Changed from submit ID to avoid conflicts, form submit event handles it
const submitBtn = document.getElementById("submit");

// submit button 
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

    const task = new Task(
        taskTitle,
        taskDescription,
        taskPriority,
        taskStatus,
        currentParentId,
    )

    tasks.push(task);
    saveTasks(tasks);
    renderTasks(tasks); // Re-render everything to show subtask in correct position

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

// Clear validation messages on reset on both forms
[taskForm, subTaskForm].forEach(form => {
    form.addEventListener("reset", () => form.classList.remove('was-validated'));
});

//added functions to global scope for inline HTML handlers
window.deleteTask = deleteTask;
window.completeTask = completeTask;
window.prepareSubTask = prepareSubTask;
window.searchTask = searchTask;