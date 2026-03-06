//Get Tasks from Local Storage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

//Add Task to the Table
document.getElementById("task-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const taskTitle = document.getElementById("taskTitle").value;
    const taskDescription = document.getElementById("taskDescription").value;
    const taskPriority = document.querySelector('input[name="taskPriority"]:checked').value;
    const taskStatus = document.querySelector('input[name="status"]:checked').value;

    function validId() {
        return Math.random().toString(36).substring(2, 10);
    }

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
    addTask(task);

    // Reset the form after submitting
    document.getElementById("task-form").reset();
});

//Add Task to the Table
function addTask(task) {
    const taskList = document.getElementById("tasks");

    const tr = document.createElement("tr");
    tr.dataset.id = task.id;

    if (task.status === "completed") {
        tr.classList.add("completed");
    }

    tr.innerHTML = `
        <td>${task.title}</td>
        <td>${task.id}</td>
        <td>${task.description}</td>
        <td><span class="badge ${task.priority === 'high' ? 'bg-danger' : task.priority === 'medium' ? 'bg-warning text-dark' : 'bg-success'}">${task.priority}</span></td>
        <td>${task.createdAt}</td>
        <td><span class="badge ${task.status === 'completed' ? 'bg-success' : 'bg-secondary'} status-text">${task.status}</span></td>
        <td>
            <button class="btn btn-danger btn-sm" onclick="deleteTask(this)">Delete</button>
            <button class="btn btn-success btn-sm" onclick="completeTask(this)" ${task.status === "completed" ? "disabled" : ""}>Completed</button>
        </td>
    `;

    taskList.appendChild(tr);
}

//Delete Task from the Table
function deleteTask(button) {
    const tr = button.closest("tr");
    if (tr) {
        const id = tr.dataset.id;
        tasks = tasks.filter(t => String(t.id) !== String(id));
        saveTasks();
        tr.remove();
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
            const statusBadge = tr.querySelector(".status-text");
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
    tasks.forEach(task => addTask(task));
}

//Save Tasks to Local Storage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

//Search Task
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

const searchTask = debounce(performSearch, 300);