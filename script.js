const showCreateTaskForm = () => {
    document.getElementById("create-task").style.display = 'block';
};

const closeCreateTaskForm = () => {
    document.getElementById("create-task").style.display = 'none';    
}

const createTaskBtn = document.getElementById("btn-create-a-task");
createTaskBtn.onclick = showCreateTaskForm;
const closeTaskForm = document.getElementById("close-task-form");
closeTaskForm.onclick = closeCreateTaskForm;