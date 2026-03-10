//Get Tasks from Local Storage
export function getTasks() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
}

//Save Tasks to Local Storage
export function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
