let form = document.getElementById("task_list")
let list = document.getElementById("list")
let filter = document.getElementById("filter")
let clearBtn = document.getElementById("clear")
let newTask = document.getElementById("newTask")
let historyList = document.getElementById("history_list")

// define event listeners
form.addEventListener("submit", addTask)
list.addEventListener("click", deleteTask)
clearBtn.addEventListener("click", clearTask)
filter.addEventListener("keyup", filterTask)
document.addEventListener("DOMContentLoaded", getTask)
list.addEventListener("change", checkTaskCompleted)

// functionalty

// Add Task
function addTask(e) {
    if (newTask.value === "") {
        alert("Add a Task!")
    } else {
        let li = createTaskElement(newTask.value);
        list.appendChild(li);

        storeTaskInLocalStorage(newTask.value)

        newTask.value = ""
    }
    e.preventDefault()
}

// Function to create a task element (li) with checkbox and delete link
function createTaskElement(taskText) {
    let li = document.createElement("li")
    
    let checkbox = document.createElement("input")
    checkbox.type = "checkbox"
    checkbox.className = "complete-task"
    
    li.appendChild(checkbox)
    li.appendChild(document.createTextNode(` ${taskText} `))

    let a = document.createElement("a")
    a.setAttribute("href", "#")
    a.innerText = "x"
    li.appendChild(a)

    return li
}

// Check task completed and move to history
function checkTaskCompleted(e) {
    if (e.target.classList.contains("complete-task")) {
        let li = e.target.parentElement

        if (e.target.checked) {
            // Move to history
            historyList.appendChild(li)
            removeFromLocalStorage(li)
            storeCompletedTaskInLocalStorage(li.textContent.trim())
        } else {
            // Move back to active tasks if unchecked
            list.appendChild(li)
            removeCompletedTaskFromLocalStorage(li)
            storeTaskInLocalStorage(li.textContent.trim())
        }
    }
}

// Remove Task
function deleteTask(e) {
    if (e.target.hasAttribute("href")) {
        if (confirm("Are You Sure?")) {
            let ele = e.target.parentElement
            ele.remove()
            removeFromLocalStorage(ele)
        }
    }
}

// Clear Task
function clearTask() {
    if (confirm("Are You Sure?")) {
        list.innerHTML = ""
        localStorage.clear()
    }
}

// Filter Task
function filterTask(e) {
    let text = e.target.value.toLowerCase()
    document.querySelectorAll("li").forEach(task => {
        let item = task.textContent.toLowerCase().indexOf(text)
        if (item != -1) {
            task.style.display = "block"
        } else {
            task.style.display = "none"
        }
    })
}

// Store task in LocalStorage
function storeTaskInLocalStorage(task) {
    let tasks = getTasksFromLocalStorage("tasks")
    tasks.push(task)
    localStorage.setItem("tasks", JSON.stringify(tasks))
}

// Store completed task in LocalStorage
function storeCompletedTaskInLocalStorage(task) {
    let tasks = getTasksFromLocalStorage("completed_tasks")
    tasks.push(task)
    localStorage.setItem("completed_tasks", JSON.stringify(tasks))
}

// Get tasks from LocalStorage based on key
function getTasksFromLocalStorage(key) {
    let tasks;
    if (localStorage.getItem(key) === null) {
        tasks = []
    } else {
        tasks = JSON.parse(localStorage.getItem(key))
    }
    return tasks
}

// Get tasks from LocalStorage when page is loaded
function getTask() {
    let tasks = getTasksFromLocalStorage("tasks")
    let completedTasks = getTasksFromLocalStorage("completed_tasks")

    tasks.forEach(task => {
        let li = createTaskElement(task);
        list.appendChild(li)
    })

    completedTasks.forEach(task => {
        let li = createTaskElement(task);
        li.querySelector(".complete-task").checked = true
        historyList.appendChild(li)
    })
}

// Remove task from LocalStorage
function removeFromLocalStorage(element) {
    let tasks = getTasksFromLocalStorage("tasks")
    let li = element
    li.removeChild(li.lastChild)  // remove the 'x' link
    let text = li.textContent.trim()

    tasks.forEach((task, index) => {
        if (task === text) {
            tasks.splice(index, 1)
        }
    })
    localStorage.setItem("tasks", JSON.stringify(tasks))
}

// Remove completed task from LocalStorage
function removeCompletedTaskFromLocalStorage(element) {
    let tasks = getTasksFromLocalStorage("completed_tasks")
    let li = element
    li.removeChild(li.lastChild)  // remove the 'x' link
    let text = li.textContent.trim()

    tasks.forEach((task, index) => {
        if (task === text) {
            tasks.splice(index, 1)
        }
    })
    localStorage.setItem("completed_tasks", JSON.stringify(tasks))
}
