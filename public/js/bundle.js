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
  function Task(title, description, priority, status, parentId = null) {
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.status = status;
    this.parentId = parentId;
    this.id = validId();
    this.createdAt = (/* @__PURE__ */ new Date()).toLocaleString();
  }
  function ImportantTask(title, description, status, parentId = null) {
    Task.call(this, title, description, "high", status, parentId);
    this.important = true;
  }
  var init_Task = __esm({
    "public/js/models/Task.ts"() {
      init_helpers();
      ImportantTask.prototype = Object.create(Task.prototype);
      ImportantTask.prototype.constructor = ImportantTask;
    }
  });

  // public/js/services/Storage.ts
  function getTasks() {
    const tasks = localStorage.getItem("tasks");
    if (!tasks) return null;
    try {
      return JSON.parse(tasks);
    } catch (e) {
      console.error("Local storage corruption detected", e);
      return null;
    }
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
      const apiTasks = data.map((item) => {
        return new Task(
          item.title,
          "Imported from API",
          // mock description
          "low",
          // default priority
          item.completed ? "completed" : "pending",
          null
          // top level tasks
        );
      });
      const fetchedTasks = apiTasks.slice(0, 10);
      return fetchedTasks;
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
      init_Task();
    }
  });

  // public/js/ui/Renderer.ts
  function renderTasks(allTasks) {
    const taskList = document.getElementById("tasks");
    if (!taskList) return;
    taskList.innerHTML = "";
    const rootTasks = allTasks.filter((t) => !allTasks.some((p) => String(p.id) === String(t.parentId)));
    function renderTaskTree(task, level) {
      taskList.appendChild(createTaskRow(task, level));
      const mySubtasks = allTasks.filter((t) => String(t.parentId) === String(task.id));
      mySubtasks.forEach((subTask) => renderTaskTree(subTask, level + 1));
    }
    rootTasks.forEach((mainTask) => {
      renderTaskTree(mainTask, 0);
    });
  }
  function createTaskRow(task, level = 0) {
    const importantIcon = task.important ? "\u{1F525} " : "";
    const tr = document.createElement("tr");
    tr.dataset.id = task.id.toString();
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
    const titleDisplay = `${space}${importantIcon}${task.title}`;
    tr.innerHTML = `
    <td>${titleDisplay}</td>
    <td>${task.id}</td>
    <td style="width: 25%;">${task.description}</td>
    <td><span class="badge ${task.priority === "high" ? "bg-danger" : task.priority === "medium" ? "bg-warning text-dark" : "bg-success"}">${task.priority}
        </span>
    </td>
    <td>${task.createdAt}</td>
    <td><span class="badge ${task.status === "completed" ? "bg-success" : "bg-secondary"} 
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
      function getAllSubtaskIds(parentId, allTasks) {
        const subtasks = allTasks.filter((t) => String(t.parentId) === String(parentId));
        let ids = subtasks.map((t) => String(t.id));
        for (const st of subtasks) {
          ids = ids.concat(getAllSubtaskIds(String(st.id), allTasks));
        }
        return ids;
      }
      function deleteTask(button) {
        const tr = button.closest("tr");
        if (tr) {
          const id = tr.dataset.id;
          if (id) {
            const idsToDelete = [String(id), ...getAllSubtaskIds(String(id), tasks)];
            tasks = tasks.filter((t) => !idsToDelete.includes(String(t.id)));
            saveTasks(tasks);
            if (searchInput && searchInput.value) {
              performSearch();
            } else {
              renderTasks(tasks);
            }
          }
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
        const apiTasks = await loadTask();
        if (apiTasks && apiTasks.length > 0) {
          const existingTitles = new Set(tasks.map((t) => t.title));
          const newTasks = apiTasks.filter((t) => !existingTitles.has(t.title));
          if (newTasks.length > 0) {
            tasks.push(...newTasks);
            saveTasks(tasks);
            renderTasks(tasks);
          }
        }
      };
      function performSearch() {
        const searchEl = document.getElementById("search");
        if (!searchEl) return;
        const query = searchEl.value.toLowerCase();
        if (!query) {
          renderTasks(tasks);
          return;
        }
        const matchedTaskIds = /* @__PURE__ */ new Set();
        const directMatches = tasks.filter(
          (t) => t.title.toLowerCase().includes(query) || t.description && t.description.toLowerCase().includes(query)
        );
        const addAncestors = (taskId) => {
          let currentTask = tasks.find((t) => String(t.id) === String(taskId));
          while (currentTask && currentTask.parentId) {
            matchedTaskIds.add(String(currentTask.parentId));
            currentTask = tasks.find((t) => String(t.id) === String(currentTask.parentId));
          }
        };
        directMatches.forEach((t) => {
          matchedTaskIds.add(String(t.id));
          addAncestors(String(t.id));
          const descendants = getAllSubtaskIds(String(t.id), tasks);
          descendants.forEach((id) => matchedTaskIds.add(id));
        });
        const filteredTasks = tasks.filter((t) => matchedTaskIds.has(String(t.id)));
        renderTasks(filteredTasks);
      }
      var searchTask = debounce(performSearch, 300);
      var searchInput = document.getElementById("search");
      if (searchInput) {
        searchInput.addEventListener("input", searchTask);
      }
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
        if (searchInput && searchInput.value) {
          performSearch();
        } else {
          renderTasks(tasks);
        }
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
      var tasksContainer = document.getElementById("tasks");
      if (tasksContainer) {
        tasksContainer.addEventListener("click", (event) => {
          const target = event.target;
          const completeBtn = target.closest(".task-complete-btn");
          if (completeBtn) {
            completeTask(completeBtn);
            return;
          }
          const deleteBtn = target.closest(".task-delete-btn");
          if (deleteBtn) {
            deleteTask(deleteBtn);
            return;
          }
          const subtaskBtn = target.closest(".task-subtask-btn");
          if (subtaskBtn) {
            prepareSubTask(subtaskBtn);
            return;
          }
        });
      }
    }
  });
  require_app();
})();
