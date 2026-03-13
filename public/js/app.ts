import { Task, ImportantTask } from "./models/Task.ts";
import { getTasks, saveTasks } from "./services/Storage.ts";
import { loadTask } from "./services/ApiService.ts";
import { renderTasks } from "./ui/Renderer.ts";
import { debounce, throttle } from "./utils/helpers.ts";
import { Priority, Status } from "./models/Task.ts"

//Get Tasks from Local Storage
let tasks: Task[] = getTasks() || [];

const taskForm = document.getElementById("task-form") as HTMLFormElement;

if (taskForm) {
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
            ? new (ImportantTask as any)(taskTitle, taskDescription, taskStatus)
            : new (Task as any)(taskTitle, taskDescription, taskPriority, taskStatus);

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

function getAllSubtaskIds(parentId: string, allTasks: Task[]): string[] {
    const subtasks = allTasks.filter(t => String(t.parentId) === String(parentId));
    let ids = subtasks.map(t => String(t.id));
    for (const st of subtasks) {
        ids = ids.concat(getAllSubtaskIds(String(st.id), allTasks));
    }
    return ids;
}

//Delete Task from the Table
function deleteTask(button: HTMLElement): void {
    const tr: HTMLTableRowElement | null = button.closest("tr");
    if (tr) {
        const id = tr.dataset.id;
        if (id) {
            const idsToDelete = [String(id), ...getAllSubtaskIds(String(id), tasks)];
            tasks = tasks.filter(t => !idsToDelete.includes(String(t.id)));
            saveTasks(tasks);
            if (searchInput && searchInput.value) {
                performSearch();
            } else {
                renderTasks(tasks); // Re-render to show changes
            }
        }
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
    const searchEl = document.getElementById("search") as HTMLInputElement | null;
    if (!searchEl) return;
    const query: string = searchEl.value.toLowerCase();

    if (!query) {
        renderTasks(tasks);
        return;
    }

    const matchedTaskIds = new Set<string>();
    
    // First find all matches
    const directMatches = tasks.filter(t => 
        t.title.toLowerCase().includes(query) || 
        (t.description && t.description.toLowerCase().includes(query))
    );
    
    // Helper to get all ancestors
    const addAncestors = (taskId: string) => {
        let currentTask = tasks.find(t => String(t.id) === String(taskId));
        while (currentTask && currentTask.parentId) {
            matchedTaskIds.add(String(currentTask.parentId));
            currentTask = tasks.find(t => String(t.id) === String(currentTask!.parentId));
        }
    };
    
    directMatches.forEach(t => {
        matchedTaskIds.add(String(t.id));
        addAncestors(String(t.id));
        const descendants = getAllSubtaskIds(String(t.id), tasks);
        descendants.forEach(id => matchedTaskIds.add(id));
    });

    const filteredTasks: Task[] = tasks.filter(t => matchedTaskIds.has(String(t.id)));
    renderTasks(filteredTasks);
}
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

    const task: Task = new (Task as any)(
        taskTitle,
        taskDescription,
        taskPriority,
        taskStatus,
        currentParentId,
    )

    tasks.push(task);
    saveTasks(tasks);
    
    // Check if we are searching, modify rendering accordingly
    if (searchInput && searchInput.value) {
        performSearch();
    } else {
        renderTasks(tasks); 
    }

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

// Event delegation for dynamically added task buttons
const tasksContainer = document.getElementById("tasks");
if (tasksContainer) {
    tasksContainer.addEventListener("click", (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        
        const completeBtn = target.closest(".task-complete-btn") as HTMLButtonElement | null;
        if (completeBtn) {
            completeTask(completeBtn);
            return;
        }

        const deleteBtn = target.closest(".task-delete-btn") as HTMLButtonElement | null;
        if (deleteBtn) {
            deleteTask(deleteBtn);
            return;
        }

        const subtaskBtn = target.closest(".task-subtask-btn") as HTMLButtonElement | null;
        if (subtaskBtn) {
            prepareSubTask(subtaskBtn);
            return;
        }
    });
}