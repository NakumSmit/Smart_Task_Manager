document.getElementById("task-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const taskTitle = document.getElementById("taskTitle").value;
    const taskDescription = document.getElementById("taskDescription").value;
    const taskPriority = document.querySelector('input[name="taskPriority"]:checked').value;

    const task = {
        title: taskTitle,
        description: taskDescription,
        priority: taskPriority,
        id: Date.now(),
        status: "pending",
        createdAt: new Date().toLocaleString()
    };

    addTask(task);

    // Reset the form after submitting
    document.getElementById("task-form").reset();
});

function addTask(task) {
    const taskList = document.getElementById("tasks");

    const li = document.createElement("li");
    li.classList.add("task");
    li.innerHTML = `
        <div class="task-info">
            <h3>${task.title} <span class="priority-badge ${task.priority}">${task.priority}</span></h3>
            <p>${task.description}</p>
            <p>Status: ${task.status} | Created: ${task.createdAt}</p>
        </div>
        <div class="task-actions">
            <button class="delete-btn" onclick="deleteTask(this)">Delete</button>
            <button class="edit-btn" onclick="editTask(this)">Edit</button>
        </div>
    `;

    taskList.appendChild(li);
}

function deleteTask(button) {
    const li = button.closest("li");
    if (li) {
        li.remove();
    }

function editTask(button) {
    
}
}