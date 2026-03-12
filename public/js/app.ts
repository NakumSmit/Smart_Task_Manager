import { Task, ImportantTask } from "./models/Task.ts";
import { getTasks, saveTasks } from "./services/Storage.ts";
import { loadTask } from "./services/ApiService.ts";
import { renderTasks } from "./ui/Renderer.ts";
import { debounce, throttle } from "./utils/helpers.ts";
import { Priority, Status } from "./models/Task.ts"

//Get Tasks from Local Storage
let tasks: Task[] = getTasks() || [];

const taskForm = document.getElementById("task-form") as HTMLFormElement;

if(taskForm){
taskForm.addEventListener("submit", function (event: SubmitEvent): void {
    event.preventDefault();

    if (!taskForm.checkValidity()) {
        event.stopPropagation();
        taskForm.classList.add('was-validated');
        return;
    }

    const taskTitle: string = (document.getElementById("taskTitle") as HTMLInputElement).value;
    const taskDescription: string = (document.getElementById("taskDescription") as HTMLInputElement).value;
    const taskPriority: Priority = (document.querySelector('input[name="taskPriority"]:checked') as HTMLInputElement).value as Priority;
    const taskStatus: Status = (document.querySelector('input[name="status"]:checked') as HTMLInputElement).value as Status;

    const task: Task | ImportantTask = taskPriority === "high"
        ? new ImportantTask(taskTitle, taskDescription, taskStatus)
        : new Task(taskTitle, taskDescription, taskPriority, taskStatus);

    tasks.push(task);
    saveTasks(tasks);
    renderTasks(tasks);

    // Reset the form after submitting
    taskForm.reset();
    taskForm.classList.remove('was-validated');
});
}

let currentParentId: string | null = null;

//Add SubTask
function prepareSubTask(button: HTMLElement) {
    const tr: HTMLTableRowElement = button.closest("tr") as HTMLTableRowElement;
    if (tr) {
        currentParentId = tr.dataset.id || null;
    }
}

//Delete Task from the Table
function deleteTask(button: HTMLElement): void {
    const tr: HTMLTableRowElement | null = button.closest("tr");
    if (tr) {
        const id = tr.dataset.id;
        // Also remove any subtasks that belong to this task
        tasks = tasks.filter(t => String(t.id) !== String(id) && String(t.parentId) !== String(id));
        saveTasks(tasks);
        renderTasks(tasks); // Re-render to show changes
    }
}

//Mark Completed on click of the button
function completeTask(button: HTMLButtonElement) {
    const tr: HTMLTableRowElement | null = button.closest("tr");
    if (tr) {
        const id: string = tr.dataset.id as string;
        const task: Task | undefined = tasks.find(t => t.id === id);
        if (task) {
            task.status = "completed";
            saveTasks(tasks);

            // Update the status badge in the table
            const statusBadge: HTMLElement | null = tr.querySelector(".statusText");
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
window.onload = async function (): Promise<void> {
    renderTasks(tasks);
    await loadTask(); // Automatically fetch data without a button
}

//Search Task
function performSearch(): void {
    const query: string = (document.getElementById("search") as HTMLInputElement).value.toLowerCase();

    if (!query) {
        renderTasks(tasks);
        return;
    }
    const filteredTasks: Task[] = tasks.filter(t => t.title.toLowerCase().includes(query));
    renderTasks(filteredTasks);
}
//Attach the search task function with debounce
// const searchTask: () => void = debounce(performSearch, 300);

//Attach the search task function with debounce
const searchTask: () => void = debounce(performSearch, 300);

const searchInput = document.getElementById("search") as HTMLInputElement | null;

if (searchInput) {
    searchInput.addEventListener("input", searchTask);
}

// Attach the scroll logging function to the scroll event with a throttle
window.addEventListener("scroll", throttle(function () { console.log("Scrolled") }, 500));

//Sub task
const subTaskForm: HTMLFormElement | null = document.getElementById("subTask-form") as HTMLFormElement;
// Changed from submit ID to avoid conflicts, form submit event handles it
const submitBtn = document.getElementById("submit");

// submit button 
if (submitBtn) {
    submitBtn.addEventListener("click", () => subTaskForm.requestSubmit());
}

subTaskForm.addEventListener("submit", function (event: SubmitEvent): void {
    event.preventDefault();

    if (!subTaskForm.checkValidity()) {
        event.stopPropagation();
        subTaskForm.classList.add('was-validated');
        return;
    }

    const taskTitle: string = (document.getElementById("subTask-title") as HTMLInputElement).value;
    const taskDescription: string = (document.getElementById("subTask-description") as HTMLInputElement).value;
    const taskPriority: Priority = (document.querySelector('input[name="subTaskPriority"]:checked') as HTMLInputElement).value as Priority;
    const taskStatus: Status = (document.querySelector('input[name="subTaskStatus"]:checked') as HTMLInputElement).value as Status;

    const task: Task = new Task(
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
    const modalElement: HTMLElement | null = document.getElementById('inputModal');
    // @ts-ignore
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) {
        modal.hide();
    }

    currentParentId = null; // Reset
});

// Clear validation messages on reset on both forms
[taskForm, subTaskForm].forEach((form: HTMLFormElement) => {
    form.addEventListener("reset", () => form.classList.remove('was-validated'));
});

//added functions to global scope for inline HTML handlers
declare global {
    interface Window {
        deleteTask: typeof deleteTask;
        completeTask: typeof completeTask;
        prepareSubTask: typeof prepareSubTask;
        searchTask: typeof searchTask;
    }
}
window.deleteTask = deleteTask;
window.completeTask = completeTask;
window.prepareSubTask = prepareSubTask;
window.searchTask = searchTask;