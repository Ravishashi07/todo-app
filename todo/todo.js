let tasks = [];
let editIndex = null;




document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
        window.location.href = "/"; 
        return;
    }

    const storedTasks = JSON.parse(localStorage.getItem(`tasks_${currentUser.username}`));
    if (storedTasks) {
        storedTasks.forEach((task) => tasks.push(task));
    }

    updateTasksList();
    updateStats();
});

window.addEventListener("pageshow", function (e) {
  if (!localStorage.getItem("currentUser")) {
    window.location.href = "/";
  }
});


if (window.location.search) {
    history.replaceState(null, '', window.location.pathname);
}


const saveTasks = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) return;
    localStorage.setItem(`tasks_${currentUser.username}`, JSON.stringify(tasks));
};


const showToast = (message) => {
    const toast = document.querySelector("#toast");
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
};

const addTask = () => {
    const taskInput = document.querySelector("#taskInput");
    const text = taskInput.value.trim();

    if (text) {
        if (editIndex !== null) {
            tasks[editIndex].text = text;
            showToast("✏️ Task edited");
            editIndex = null;
        } else {
            tasks.push({ text: text, completed: false });
            showToast("✅ Task added");
        }
        taskInput.value = "";
        updateTasksList();
        updateStats();
        saveTasks();
    }
};

const editTask = (index) => {
    const taskInput = document.querySelector("#taskInput");
    taskInput.value = tasks[index].text;
    taskInput.focus();
    editIndex = index;
    showToast("✏️ Task ready to edit");
};

const deleteTask = (index) => {
    tasks.splice(index, 1);
    updateTasksList();
    updateStats();
    saveTasks();
    showToast("🗑️ Task deleted");
};

const toggleTaskComplete = (index) => {
    tasks[index].completed = !tasks[index].completed;
    updateTasksList();
    updateStats();
    saveTasks();
};

const updateStats = () => {
    const completeTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const progress = totalTasks === 0 ? 0 : (completeTasks / totalTasks) * 100;

    const progressBar = document.querySelector("#progress");
    progressBar.style.width =  ` ${progress}%`;

    document.querySelector("#numbers").innerText =` ${completeTasks}/${totalTasks}`;

    if (tasks.length && completeTasks === totalTasks) {
        blastConfetti();
    }
};

const updateTasksList = () => {
    const taskList = document.querySelector("#task-list");
    taskList.innerHTML = '';

    const searchQuery = document.querySelector("#searchInput").value.toLowerCase();
    const filter = document.querySelector("#filter").value;

    let filteredTasks = tasks;

    if (filter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    } else if (filter === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    if (searchQuery) {
        filteredTasks = filteredTasks.filter(task =>
            task.text.toLowerCase().includes(searchQuery)
        );
    }

    filteredTasks.forEach((task) => {
    const index = tasks.indexOf(task); // get original index
    const listItem = document.createElement('li');

    listItem.innerHTML = `
    <div class="taskItem">
        <div class="task ${task.completed ? 'completed' : ''}">
            <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''}>
            <p>${task.text}</p>
        </div>
        <div class="icons">
            <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="#00f0ff"  stroke-width="1.7"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-edit" onClick="editTask(${index})"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" /><path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" /><path d="M16 5l3 3" /></svg>
            <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="red"  stroke-width="1.7"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-trash" onClick="deleteTask(${index})"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
        </div>
    </div>
    `;

    listItem.addEventListener('change', () => toggleTaskComplete(index));
    taskList.append(listItem);
});

};

const blastConfetti = () => {
    const count = 200;
    const defaults = { origin: { y: 0.7 } };

    function fire(particleRatio, opts) {
        confetti(Object.assign({}, defaults, opts, {
            particleCount: Math.floor(count * particleRatio),
        }));
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
};

const newTask = document.querySelector("#newTask");
newTask.addEventListener("click", function (e) {
    e.preventDefault();
    addTask();
});

const filterSelect = document.querySelector("#filter");
filterSelect.addEventListener("change", () => {
    updateTasksList();
});

const searchInput = document.querySelector("#searchInput");
searchInput.addEventListener("input", () => {
    updateTasksList();
});

const currentUser=JSON.parse(localStorage.getItem("currentUser"));
document.querySelector("#usernameDisplay").textContent=`👤 ${currentUser?.username || "Guest"}`;

const profileIcon=document.querySelector("#profileIcon");
const dropdownMenu=document.querySelector("#dropdownMenu");

profileIcon.addEventListener('click',()=>{
    dropdownMenu.style.display=dropdownMenu.style.display==="block"?"none":"block";
});

window.addEventListener('click',function(e){
    if(!this.document.querySelector('.profile-container').contains(e.target)){
        dropdownMenu.style.display="none";
    }
});

document.querySelector("#logoutBtn").addEventListener('click',()=>{
    localStorage.removeItem("currentUser");
    localStorage.removeItem("rememberedUsername");
    localStorage.removeItem("rememberedPassword");
    window.location.href="/";
});

window.addEventListener("beforeunload", () => {
    localStorage.removeItem("currentUser");
});
