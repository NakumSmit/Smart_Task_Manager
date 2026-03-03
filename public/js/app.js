//Get Tasks from Local Storage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

//Add Task to the list
document.getElementById("task-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const taskTitle = document.getElementById("taskTitle").value;
    const taskDescription = document.getElementById("taskDescription").value;
    const taskPriority = document.querySelector('input[name="taskPriority"]:checked').value;

    const task = {
        title: taskTitle,
        description: taskDescription,
        priority: taskPriority,
        id: Date.now().toString(),
        status: "pending",
        createdAt: new Date().toLocaleString()
    };

    tasks.push(task);
    saveTasks();
    addTask(task);

    // Reset the form after submitting
    document.getElementById("task-form").reset();
});

//Add Task to the list
function addTask(task) {
    const taskList = document.getElementById("tasks");

    const li = document.createElement("li");
    li.classList.add("task");
    li.dataset.id = task.id;

    if (task.status === "completed") {
        li.classList.add("completed");
    }

    li.innerHTML = `
        <div class="task-info">
            <h3>${task.title} <span class="priority-badge ${task.priority}">${task.priority}</span></h3>
            <p>ID: ${task.id}</p>
            <p>${task.description}</p>
            <p class="status">Status: ${task.status} | Created: ${task.createdAt}</p>
        </div>
        <div class="task-actions">
            <button class="delete-btn" onclick="deleteTask(this)">Delete</button>
            <button class="complete-btn" onclick="completeTask(this)" ${task.status === "completed" ? "disabled" : ""}>Completed</button>
        </div>
    `;

    taskList.appendChild(li);
}

//Delete Task from the list
function deleteTask(button) {
    const li = button.closest("li");
    if (li) {
        const id = li.dataset.id;
        tasks = tasks.filter(t => String(t.id) !== String(id));
        saveTasks();
        li.remove();
    }
}

//Mark Completed on click of the button
function completeTask(button) {
    const li = button.closest("li");
    if (li) {
        const id = li.dataset.id;
        const task = tasks.find(t => String(t.id) === String(id));
        if (task) {
            task.status = "completed";
            saveTasks();
            li.querySelector(".status").textContent = `Status: ${task.status} | Created: ${task.createdAt}`;
        }

        li.classList.add("completed");
        button.disabled = true;
    }
}

//Load Tasks from Local Storage
window.onload = function () {
    tasks.forEach(task => addTask(task));
}

//Save Tasks to Local Storage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}