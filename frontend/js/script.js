// Not logged in? Send to the login page.
if (!getToken()) window.location.href = 'login.html';

let tasks = [];

const addButton = document.getElementById('add');
const taskForm = document.getElementById('taskForm');
addButton.addEventListener('click', function () {
    taskForm.style.display = "block";
})

const listDue = document.querySelector("#scrollDue .list")
const listUpcoming = document.querySelector("#scrollUpcoming .list")
const listComplete = document.querySelector("#scrollComplete .list")
const listPending = document.querySelector("#scrollPending .list")

const saveButton = document.getElementById('saveTask')

const dueCount = document.querySelector("#countDueToday")
const upcomingCount = document.querySelector("#countUpcoming")
const completedCount = document.querySelector("#countCompleted")
const pendingCount = document.querySelector("#countPending")

document.getElementById('username').textContent = "Welcome " + (localStorage.getItem('username') || '');
document.getElementById('logout').addEventListener('click', logout);

// Local date (YYYY-MM-DD). toISOString() uses UTC and would be off by a day
// for part of the day in timezones like India.
function getToday() {
    const d = new Date();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + "-" + m + "-" + day;
}

function displayTasks() {
    const today = getToday();

    [listDue, listUpcoming, listComplete, listPending].forEach(l => l.innerHTML = "");

    let countDue = 0, countUpcoming = 0, countComplete = 0, countPending = 0;

    tasks.forEach(function (t) {
        const newTask = document.createElement("li");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        const text = document.createElement("span");
        text.textContent = t.text + " " + t.category;

        const del = document.createElement("span");
        del.className = "delete";
        del.textContent = "🗑";
        del.title = "Delete task";

        newTask.appendChild(checkbox);
        newTask.appendChild(text);
        newTask.appendChild(del);

        if (t.complete) {
            checkbox.checked = true;
            text.style.textDecoration = "line-through";
            countComplete++;
            newTask.removeChild(checkbox);
            listComplete.appendChild(newTask);
        }
        else if (t.date === today) {
            countDue++;
            listDue.appendChild(newTask);
        }
        else if (t.date < today) {
            countPending++;
            listPending.appendChild(newTask);
        }
        else {
            countUpcoming++;
            listUpcoming.appendChild(newTask);
        }

        checkbox.addEventListener("change", async function () {
            if (!checkbox.checked) return;
            checkbox.disabled = true;
            try {
                await apiRequest('/tasks/' + t._id + '/complete', 'PATCH');
                t.complete = true;
                text.style.textDecoration = "line-through";
                // short pause so the strike-through is visible, then move it to Completed
                setTimeout(displayTasks, 800);
            } catch (err) {
                checkbox.checked = false;
                checkbox.disabled = false;
                alert(err.message);
            }
        });

        del.addEventListener("click", async function () {
            try {
                await apiRequest('/tasks/' + t._id, 'DELETE');
                tasks = tasks.filter(x => x._id !== t._id);
                displayTasks();
            } catch (err) {
                alert(err.message);
            }
        });
    });

    dueCount.textContent = countDue;
    upcomingCount.textContent = countUpcoming;
    completedCount.textContent = countComplete;
    pendingCount.textContent = countPending;
}

async function loadTasks() {
    try {
        tasks = await apiRequest('/tasks');
        displayTasks();
    } catch (err) {
        alert(err.message);
    }
}
loadTasks();

saveButton.addEventListener('click', async function (e) {
    e.preventDefault();

    const text = document.querySelector("#taskText").value.trim();
    const date = document.querySelector("#dueDate").value;
    const category = document.querySelector("#category").value;

    if (!text || !date) {
        alert("Please enter a task and a due date.");
        return;
    }

    try {
        const saved = await apiRequest('/tasks', 'POST', { text, date, category });
        tasks.push(saved);
        displayTasks();
    } catch (err) {
        alert(err.message);
        return;
    }

    document.querySelector("#taskText").value = "";
    document.querySelector("#dueDate").value = "";
    document.querySelector("#category").value = "";

    taskForm.style.display = "none";
})

const resetButton = document.getElementById("reset");

// Reset now clears only the logged-in user's tasks from the database
resetButton.addEventListener("click", async function () {
    if (!confirm("Delete ALL your tasks? This cannot be undone.")) return;
    try {
        await apiRequest('/tasks', 'DELETE');
        tasks = [];
        displayTasks();
    } catch (err) {
        alert(err.message);
    }
});
