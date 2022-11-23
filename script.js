const showCreateTaskForm = () => {
        document.getElementById("create-task").style.display = 'block';
        console.log('Creating task.');
}

const resetCreateTaskForm = () => {
        document.getElementById("create-task").style.display = 'block';
        console.log('Resetting create task.')
}

const closeCreateTaskForm = () => {
        document.getElementById("create-task").style.display = 'none';
        console.log('Closing task.')
}

const createTaskBtn = document.getElementById("createTask");
createTaskBtn.onclick = showCreateTaskForm;
const resetTaskBtn = document.getElementById("resetTask");
resetTaskBtn.onclick = resetCreateTaskForm;
const closeTaskForm = document.getElementById("closeTask");
closeTaskForm.onclick = closeCreateTaskForm;