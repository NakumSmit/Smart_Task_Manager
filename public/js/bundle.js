(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // public/js/utils/helpers.ts
  function validId() {
    return Math.random().toString(36).substring(2, 10);
  }
  function debounce(func, delay) {
    let timeout = null;
    return function(...args) {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        func(...args);
        timeout = null;
      }, delay);
    };
  }
  function throttle(func, delay) {
    let timeout = null;
    return function(...args) {
      if (timeout) {
        return;
      }
      timeout = setTimeout(() => {
        func(...args);
        timeout = null;
      }, delay);
    };
  }
  var init_helpers = __esm({
    "public/js/utils/helpers.ts"() {
    }
  });

  // public/js/models/Task.ts
  var Task, ImportantTask;
  var init_Task = __esm({
    "public/js/models/Task.ts"() {
      init_helpers();
      Task = class {
        id;
        title;
        description;
        priority;
        status;
        parentId;
        createdAt;
        important;
        constructor(title, description, priority, status, parentId = null) {
          this.title = title;
          this.description = description;
          this.priority = priority;
          this.status = status;
          this.parentId = parentId;
          this.id = validId();
          this.createdAt = (/* @__PURE__ */ new Date()).toLocaleString();
        }
      };
      ImportantTask = class extends Task {
        important;
        constructor(title, description, status, parentId = null) {
          super(title, description, "high", status, parentId);
          this.important = true;
        }
      };
    }
  });

  // public/js/services/Storage.ts
  function getTasks() {
    const tasks = localStorage.getItem("tasks");
    if (!tasks) return null;
    return JSON.parse(tasks);
  }
  function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
  var init_Storage = __esm({
    "public/js/services/Storage.ts"() {
    }
  });

  // public/js/services/ApiService.ts
  async function loadTask() {
    const loadingState = document.getElementById("loading-state");
    if (loadingState) {
      loadingState.style.display = "flex";
    }
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/todos");
      await new Promise((resolve) => setTimeout(resolve, 2e3));
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = await response.json();
      const tasks = data;
      const fetchedTasks = tasks.slice(0, 10);
      console.log("Fetched API Tasks:", fetchedTasks);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error in fetching:", error.message);
      } else {
        console.error("Unknown error:", error);
      }
    } finally {
      if (loadingState) {
        loadingState.style.display = "none";
      }
    }
  }
  var init_ApiService = __esm({
    "public/js/services/ApiService.ts"() {
    }
  });

  // public/js/ui/Renderer.ts
  function renderTasks(tasks) {
    const taskList = document.getElementById("tasks");
    if (!taskList) return;
    taskList.innerHTML = "";
    const mainTasks = tasks.filter((t) => !t.parentId);
    mainTasks.forEach((mainTask) => {
      taskList.appendChild(createTaskRow(mainTask, false));
      const mySubtasks = tasks.filter((t) => t.parentId === mainTask.id);
      mySubtasks.forEach((subTask) => {
        taskList.appendChild(createTaskRow(subTask, true));
      });
    });
  }
  function createTaskRow(task, isSubtask = false) {
    const importantIcon = task.important ? "\u{1F525} " : "";
    const tr = document.createElement("tr");
    tr.dataset.id = task.id.toString();
    if (task.status === "completed") {
      tr.classList.add("completed");
    }
    if (isSubtask) {
      tr.classList.add("subtask-row");
    }
    const titleDisplay = isSubtask ? `<span class="ps-4">--> ${importantIcon}${task.title}</span>` : `${importantIcon}${task.title}`;
    tr.innerHTML = `
    <td>${titleDisplay}</td>
    <td>${task.id}</td>
    <td style="width: 25%;">${task.description}</td>
    <td><span class="badge ${task.priority === "high" ? "bg-danger" : task.priority === "medium" ? "bg-warning text-dark" : "bg-success"}">${task.priority}</span></td>
    <td>${task.createdAt}</td>
    <td><span class="badge ${task.status === "completed" ? "bg-success" : "bg-secondary"} statusText">${task.status}</span></td>
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
  var init_Renderer = __esm({
    "public/js/ui/Renderer.ts"() {
    }
  });

  // public/js/app.ts
  var require_app = __commonJS({
    "public/js/app.ts"() {
      init_Task();
      init_Storage();
      init_ApiService();
      init_Renderer();
      init_helpers();
      var tasks = getTasks() || [];
      var taskForm = document.getElementById("task-form");
      if (taskForm) {
        taskForm.addEventListener("submit", function(event) {
          event.preventDefault();
          if (!taskForm.checkValidity()) {
            event.stopPropagation();
            taskForm.classList.add("was-validated");
            return;
          }
          const taskTitle = document.getElementById("taskTitle").value;
          const taskDescription = document.getElementById("taskDescription").value;
          const taskPriority = document.querySelector('input[name="taskPriority"]:checked').value;
          const taskStatus = document.querySelector('input[name="status"]:checked').value;
          const task = taskPriority === "high" ? new ImportantTask(taskTitle, taskDescription, taskStatus) : new Task(taskTitle, taskDescription, taskPriority, taskStatus);
          tasks.push(task);
          saveTasks(tasks);
          renderTasks(tasks);
          taskForm.reset();
          taskForm.classList.remove("was-validated");
        });
      }
      var currentParentId = null;
      function prepareSubTask(button) {
        const tr = button.closest("tr");
        if (tr) {
          currentParentId = tr.dataset.id || null;
        }
      }
      function deleteTask(button) {
        const tr = button.closest("tr");
        if (tr) {
          const id = tr.dataset.id;
          tasks = tasks.filter((t) => String(t.id) !== String(id) && String(t.parentId) !== String(id));
          saveTasks(tasks);
          renderTasks(tasks);
        }
      }
      function completeTask(button) {
        const tr = button.closest("tr");
        if (tr) {
          const id = tr.dataset.id;
          const task = tasks.find((t) => t.id === id);
          if (task) {
            task.status = "completed";
            saveTasks(tasks);
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
      window.onload = async function() {
        renderTasks(tasks);
        await loadTask();
      };
      function performSearch() {
        const query = document.getElementById("search").value.toLowerCase();
        if (!query) {
          renderTasks(tasks);
          return;
        }
        const filteredTasks = tasks.filter((t) => t.title.toLowerCase().includes(query));
        renderTasks(filteredTasks);
      }
      var searchTask = debounce(performSearch, 300);
      window.addEventListener("scroll", throttle(function() {
        console.log("Scrolled");
      }, 500));
      var subTaskForm = document.getElementById("subTask-form");
      var submitBtn = document.getElementById("submit");
      if (submitBtn) {
        submitBtn.addEventListener("click", () => subTaskForm.requestSubmit());
      }
      subTaskForm.addEventListener("submit", function(event) {
        event.preventDefault();
        if (!subTaskForm.checkValidity()) {
          event.stopPropagation();
          subTaskForm.classList.add("was-validated");
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
          currentParentId
        );
        tasks.push(task);
        saveTasks(tasks);
        renderTasks(tasks);
        subTaskForm.reset();
        subTaskForm.classList.remove("was-validated");
        const modalElement = document.getElementById("inputModal");
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();
        }
        currentParentId = null;
      });
      [taskForm, subTaskForm].forEach((form) => {
        form.addEventListener("reset", () => form.classList.remove("was-validated"));
      });
      window.deleteTask = deleteTask;
      window.completeTask = completeTask;
      window.prepareSubTask = prepareSubTask;
      window.searchTask = searchTask;
    }
  });
  require_app();
})();
