const currentDate = new Date();
const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };

        document.getElementById("current-date").innerHTML = currentDate.toLocaleDateString('en-au', options);
        
        console.log(currentDate.toLocaleDateString('en-au', options));

const showCreateTaskForm = () => {
    document.getElementById("create-task").style.display = 'block';
    console.log('Creating task.');
    const td = new Date();
    // set minimum date as today
    document.getElementById("InputDate").setAttribute('min', td.toISOString().split('T')[0]);        
}

const resetCreateTaskForm = () => {
    document.getElementById("create-task").style.display = 'block';
    console.log('Resetting create task.');
}

const clearInputsOfCreateTaskForm = () => {
    document.getElementById("InputTitle").value = "";
    document.getElementById("InputName").value = "";
    document.getElementById("InputDesc").value = "";        
    document.getElementById("InputDate").value = "";
    document.getElementById("InputStatus").value = "";        
}
const closeCreateTaskForm = () => {
    document.getElementById("create-task").style.display = 'none';
    console.log('Closing task.');
    clearInputsOfCreateTaskForm();
}

const createTaskBtn = document.getElementById("createTask");
createTaskBtn.onclick = showCreateTaskForm;
const resetTaskBtn = document.getElementById("resetTask");
resetTaskBtn.onclick = resetCreateTaskForm;
const closeTaskForm = document.getElementById("closeTask");
closeTaskForm.onclick = closeCreateTaskForm;


const submitTask = document.getElementById("submitTask");
submitTask.addEventListener("click", validateTaskForm);

// Name -> Not Empty and longer than 8 characters
// Description -> Not Empty and longer than 15 characters
// AssignedTo -> Not Empty and longer than 8 characters
// DueDate -> Not Empty and not less than current date
function validateTaskForm(event) { 
    const inputTitle = document.getElementById("InputTitle");
    const inputName = document.getElementById("InputName");    
    const inputDesc = document.getElementById("InputDesc");        
    const inputDate = document.getElementById("InputDate");
    const inputStatus = document.getElementById("InputStatus");
    const userInput = {};

    event.preventDefault();

    if (inputTitle.checkValidity()) {
        inputTitle.setCustomValidity("");
        userInput.Title = inputTitle.value;
    } else {
        inputTitle.setCustomValidity("minimum 9 characters, please");
    }

    if (inputName.checkValidity()) {
        inputName.setCustomValidity("");
        userInput.AssignedTo = inputName.options[inputName.selectedIndex].text;
    } else {
        inputName.setCustomValidity("minmum 9 characters, please");
    }

    if (inputDesc.checkValidity()) {
        inputDesc.setCustomValidity("");
        userInput.Description = inputDesc.value;
    } else {
        inputDesc.setCustomValidity("minimum 15 characters, please");
    }

    if (inputDate.checkValidity()) {
        inputDate.setCustomValidity("");
        userInput.dueDate = inputDate.value;
    } else {
        inputDate.setCustomValidity("date must be today or future days, please");
    }

    if (inputStatus.checkValidity()) {
        inputStatus.setCustomValidity("");
        userInput.Status = inputStatus.options[inputStatus.selectedIndex].text;
    } else {
        inputStatus.setCustomValidity("choose a status, please");
    }

    createATask(userInput);
    clearInputsOfCreateTaskForm();
}

const createATask = (userInput) => {
    const taskObj = createATaskObj();
    taskObj.Title = userInput.Title;
    taskObj.Description = userInput.Description;
    const [yearValue, monthValue, dayValue] = userInput.dueDate.split('-');
    taskObj.DueDate ={day: dayValue, month: monthValue, year: yearValue};
    taskObj.AssignedTo = userInput.AssignedTo;
    taskObj.Status = userInput.Status;

    const taskHTML = myTaskManager.addTaskHTML(taskObj);
    myTaskManager.addTask(taskObj);
    myTaskManager.renderTask(taskHTML);
}

const createATaskObj = () => {
    return {
        ID: 0,
        Title: "",
        Description: "",
        AssignedTo: "",
        DueDate: {
            day: 0,
            month: 0,
            year: 0
        },
        Status: "",
        cardHeaderBackgrounds: {
            "To Do": "bg-info",
            "In Progress": "bg-warning",
            "In Review": "bg-primary",
            "Done": "bg-success"
        }
    }
};

class TaskManager {
    constructor(user) {
        this._user = user;
        this._tasks = [];
        this._currentID = 0;
    }

    get getAllTasks () {
        return this._tasks;
    }

    getTasksWithStatus(status) {
        return this._tasks.filter(
            task => {
                if (task !== null) {
                    if (task.Status === status) {
                        return true;
                    }
                } else {
                    return false;
                }
            }
        );
    }

    addTask (task) {
        task.ID = this._currentID;
        this._currentID += 1;
        this._tasks.push(task);
        console.log(`friday${task.ID}`);
        const taskStr = JSON.stringify(task);
        localStorage.setItem(`friday${task.ID}`, taskStr);
    }

    addTaskHTML(task) {
        const itemHTML = `<div id="${task.ID}" class="col mb-4">
                            <div class="card text-start shadow border-2">
                                <div class="card-header ${task.cardHeaderBackgrounds[task.Status]}"></div>
                                <!-- <img src="..." class="card-img-top" alt="..."> -->
                                <div class="card-body">
                                    <h5 class="card-title">${task.Title}</h5>
                                    <h6 class="card-subtitle mb-2 text-muted"><small>Description</small></h6>
                                    <p class="card-text"><textarea class="form-control" rows="3">${task.Description}</textarea></p>
                                    <ul class="list-group list-group-flush">
                                        <li class="list-group-item p-0">
                                            <div class="d-flex justify-content-between align-items-baseline">
                                                <h6 class="card-text text-muted"><small>Due Date</small></h6>
                                                <input type="date" value="${task.DueDate.year}-${task.DueDate.month}-${task.DueDate.day}">
                                            </div>
                                        </li>
                                        <li class="list-group-item p-0">
                                            <div class="d-flex justify-content-between align-items-baseline">
                                                <h6 class="card-subtitle my-1 text-muted"><small>Assigned To</small></h6>
                                                <select class="custom-select custom-select-sm my-1 border-0 text-muted">
                                                    <option value="1" selected><small>${task.AssignedTo}</small></option>
                                                    <option value="2"><small>Samantha</small></option>
                                                    <option value="3"><small>Daniel</small></option>
                                                </select>  
                                            </div>
                                        </li>
                                        <li class="list-group-item p-0">
                                            <div class="d-flex justify-content-between align-items-baseline">
                                                <h6 class="card-subtitle my-1 text-muted"><small>Status</small></h6> 
                                                <select class="custom-select custom-select-sm my-1 border-0 text-muted">
                                                    <option value="1" selected><small>${task.Status}</small></option>
                                                    <option value="2"><small>To Do</small></option>
                                                    <option value="3"><small>In Review</small></option>
                                                    <option value="4"><small>Done</small></option>
                                                </select>  
                                            </div>
                                        </li>
                                    </ul>                                                                         
                                </div>
                            </div>
                        </div>`;
    
        return itemHTML;
    }

    loadStoredTasks() {
        const regex = /friday\d+/;
        for (let index = 0; index < localStorage.length; index++) {
            const keyValue = localStorage.key(index); 
            console.log(`kevValue: ${keyValue}`);
            if ((undefined !== keyValue && (null !== keyValue))) {
                if (null !== keyValue.match(regex)) {
                    const storedItem = localStorage.getItem(keyValue);
                    const taskObj = JSON.parse(storedItem);
                    this._tasks.push(taskObj);
                }
            }
        }
    }

    renderTask (taskHTML) {
        const itemContainer = document.getElementById("card-list");
        itemContainer.innerHTML += taskHTML;    
    }

    addAllTaskItemsFromLocalStorage (allTasks) {
        allTasks.forEach(task => {
            const tHTML = this.addTaskHTML(task);
            this.renderTask(tHTML);
        });
    }

    removeTask (taskID) {

    }

    initiateCurrentId (id) {
        this._currentID = id;
    }
}

const myTaskManager = new TaskManager("group5");
myTaskManager.loadStoredTasks();
console.log("All tasks: \n")
console.log(myTaskManager.getAllTasks);

const allTasks = myTaskManager.getAllTasks;
const idArray = allTasks.map(task => task.ID);
if (idArray.length > 0) {
    const maxId = Math.max(...idArray);
    console.log(`max ID used last time: ${maxId}`);
    myTaskManager.initiateCurrentId(maxId);
}

myTaskManager.addAllTaskItemsFromLocalStorage(allTasks);

// ----------- this following code snippet is just for verifying the functions of class TaskManger
// and the addTaskItem function. Next, tasks will be created and added into the Task List and the Task Board
// by the user
// const newTask = createATaskObj();
// newTask.Title = "Add current date in banner";
// newTask.Description = "In the Banner, between the heading and the Create Task buttion, add a display of the current date in a user friendly form.";
// newTask.DueDate ={day: 24, month: 11, year: 2022};
// newTask.AssignedTo = "Samantha";
// newTask.Status = "In Progress";
// console.log(newTask);

// myTaskManager.addTask(newTask);
// console.log("all tasks:\n");
// console.log(myTaskManager.getAllTasks);
// console.log(myTaskManager.getTasksWithStatus("In Progress"));

// addTaskHTML(newTask);

// myTaskManager.loadStoredTasks();
// console.log("load again All tasks: \n")
// console.log(myTaskManager.getAllTasks);
// ------------ END of verifying code


