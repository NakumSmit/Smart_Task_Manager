//fetch api using promises and error handling
export async function loadTask() {
    const loadingState = document.getElementById("loading-state");
    if (loadingState) {//loading state starts
        loadingState.style.display = "flex";
    }

    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/todos");
        await new Promise(resolve => setTimeout(resolve, 2000));

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        const data = await response.json();

        // Display limited fetched data in the console
        const fetchedTasks = data.slice(0, 10);
        console.log("Fetched API Tasks:", fetchedTasks);
    } catch (error) {
        console.log("Error in fetching: " + error.message);
    } finally {//loading state ends
        if (loadingState) {
            loadingState.style.display = "none";
        }
    }
}
