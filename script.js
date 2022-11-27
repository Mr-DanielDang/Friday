const currentDate = new Date();
const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };

document.getElementById("current-date").innerHTML = currentDate.toLocaleDateString('en-au', options);

console.log(currentDate.toLocaleDateString('en-au', options));

const clearInputsOfCreateTaskForm = () => {
    document.getElementById("InputTitle").value = "";
    document.getElementById("InputName").value = "";
    document.getElementById("InputDesc").value = "";        
    document.getElementById("InputDate").value = "";
    document.getElementById("InputStatus").value = "";
}

const showError = (elementId) => {
    const referredElement = document.getElementById(elementId);
    const referredErrorSpan = document.querySelector(`#${elementId} + span.error`);

    switch (elementId) {
        case "InputTitle":
            {
                if (referredElement.validity.valueMissing) {
                    // If the field is empty, display the following error message.
                    referredErrorSpan.textContent = `please input a title, minimum ${referredElement.minLength} characters`;
                } else if ((referredElement.validity.tooShort) || (referredElement.value.length < 9)) {
                    // If the data is too short, display the following error message.
                    console.log(referredErrorSpan.textContent);
                    console.log(referredElement.minLength);
                    console.log(referredElement.value.length);
                    referredErrorSpan.textContent = `Title should be at least ${referredElement.minLength} characters; you entered ${referredElement.value.length}`;
                } 

                // Set the styling appropriately
                referredErrorSpan.className = "error active";
            }
            break;
        case "InputName":
            {
                if (referredElement.value === "0") {
                    // If an assignee was not selected, display the following error message.
                    referredErrorSpan.textContent = "please choose one assignee from the dropdown list";
                }

                // Set the styling appropriately
                referredErrorSpan.className = "error active";
            }
            break;
        case "InputDesc":
            {
                if (referredElement.validity.valueMissing) {
                    // If the field is empty, display the following error message.
                    referredErrorSpan.textContent = `please input description, minimum ${referredElement.minLength} characters`;
                } else if ((referredElement.validity.tooShort) || (referredElement.value.length < 16)) {
                    // If the data is too short, display the following error message.
                    referredErrorSpan.textContent = `Title should be at least ${referredElement.minLength} characters; you entered ${referredElement.value.length}`;
                }

                // Set the styling appropriately
                referredErrorSpan.className = "error active";                
            }
            break;
        case "InputDate":
            {
                const dateOfToday = new Date();

                if ((referredElement.value === "") || (referredElement.valueAsNumber < dateOfToday.getTime())) {
                    // If the set date is less than today.
                    referredErrorSpan.textContent = `please choose a date not less than ${dateOfToday.toISOString().split('T')[0]}`;
                }

                // Set the styling appropriately
                referredErrorSpan.className = "error active";                
            }
            break;
        case "InputStatus":
            {
                if (referredElement.value === "0") {
                    // If an assignee was not selected, display the following error message.
                    referredErrorSpan.textContent = "please choose one status from the dropdown list";
                }

                // Set the styling appropriately
                referredErrorSpan.className = "error active";
            }
            break;
        default:
            break;
    }   
};

const setEventListener = (elementId, nameOfEvent) => {
    const referredElement = document.getElementById(elementId);
    const referredErrorSpan = document.querySelector(`#${elementId} + span.error`);

    referredElement.addEventListener(nameOfEvent, (event) => {
        // Each time the user types something, we check if the form fields are valid.
        if (referredElement.validity.valid) {
            // In case there is an error message visible, if the field is valid, we remove the error message.
            referredErrorSpan.textContent = ""; // Reset the content of the message
            referredErrorSpan.className = "error"; // Reset the visual state of the message
        } else {
            // If there is still an error, show the correct error
            showError(elementId);
        }   
    });
}

const showCreateTaskForm = () => {
    document.getElementById("create-task").style.display = 'block';
    console.log('Creating task.');
    const td = new Date();
    // set minimum date as today
    document.getElementById("InputDate").setAttribute('min', td.toISOString().split('T')[0]);
    
    // set event listener to 'input' event for all input fileds
    setEventListener("InputTitle", 'input');
    setEventListener("InputName", "input");
    setEventListener("InputDesc", "input");
    setEventListener("InputDate", "input");
    setEventListener("InputStatus", "input");
}

const resetCreateTaskForm = (e) => {
    document.getElementById("create-task").style.display = 'block';
    clearInputsOfCreateTaskForm();
    e.preventDefault();
    console.log('Resetting create task.');
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
    let thereIsError = false;

    if ((inputTitle.validity.valid) && (inputTitle.value.length > 8)) {
        userInput.Title = inputTitle.value;
        inputTitle.classList.add('valid');
        console.log("Title valid");
    } else {
        console.log("Title invalid!");
        // display an appropriate error message
        showError("InputTitle");
        // prevent the form from being sent by canceling the event
        event.preventDefault();
        thereIsError = true;
    }

    if ((inputName.value !== "0")  && (inputName.options[inputName.selectedIndex].text.length > 8)){
        userInput.AssignedTo = inputName.options[inputName.selectedIndex].text;
        userInput.selectedIndexOfAssignee = inputName.selectedIndex > 0? inputName.selectedIndex - 1 : 0; 
        inputName.classList.add("valid");
        console.log("Assignee valid");
    } else {
        console.log("Assignee invalid!");
        // display an appropriate error message
        showError("InputName");
        // prevent the form from being sent by canceling the event
        event.preventDefault();
        thereIsError = true;
    }

    if ((inputDesc.validity.valid) && (inputDesc.value.length > 15)) {
        userInput.Description = inputDesc.value;
        inputDesc.classList.add("valid");
        console.log("Description valid");
    } else {
        console.log("Description invalid!");
        // display an appropriate error message
        showError("InputDesc");
        // prevent the form from being sent by canceling the event
        event.preventDefault();
        thereIsError = true;
    }

    if (inputDate.validity.valid) {
        userInput.dueDate = inputDate.value;
        inputDate.classList.add("valid");
        console.log("Due date valid");
    } else {
        console.log("Due date invalid!");
        // display an appropriate error message
        showError("InputDate");
        // prevent the form from being sent by canceling the event
        event.preventDefault();
        thereIsError = true;
    }

    if (inputStatus.value !== "0") {
        userInput.Status = inputStatus.options[inputStatus.selectedIndex].text;
        userInput.selectedIndexOfStatus = inputStatus.selectedIndex > 0? inputStatus.selectedIndex - 1 : 0;
        inputStatus.classList.add("valid");
        console.log("Status valid");
    } else {
        console.log("Status invalid!");
        // display an appropriate error message
        showError("InputStatus");
        // prevent the form from being sent by canceling the event
        event.preventDefault();
        thereIsError = true;
    }

    if (thereIsError === true) {
        return;
    }

    console.log("To create a task ...\n");
    createATask(userInput);
    clearInputsOfCreateTaskForm();
}

function onCardStatusChange(event) {
    event.preventDefault();
    const cardHeaderBackgrounds = {
        "To Do": "bg-info",
        "In Progress": "bg-warning",
        "In Review": "bg-primary",
        "Done": "bg-success"
    };
    const taskStatusId = event.target.id; // e.g. friday05
    // grap the number only from, e.g. friday05
    const taskId = taskStatusId.substring(6);
    const taskStatusValue = event.target.options[event.target.selectedIndex].text;
    const targetCard = document.getElementById(`card-header${taskId}`);
    targetCard.classList.remove("bg-info");
    targetCard.classList.remove("bg-warning");
    targetCard.classList.remove("bg-primary");
    targetCard.classList.remove("bg-success");
    targetCard.classList.add(cardHeaderBackgrounds[taskStatusValue]);

    const taskValues = {
        taskKey: taskStatusId,
        Status: taskStatusValue,
        indexOfStatus: event.target.selectedIndex
    };

    myTaskManager.updateTaskStatus(taskValues);
} 

const createATask = (userInput) => {
    const taskObj = createATaskObj(myTaskManager.currentID);
    taskObj.Title = userInput.Title;
    taskObj.Description = userInput.Description;
    const [yearValue, monthValue, dayValue] = userInput.dueDate.split('-');
    taskObj.DueDate ={day: dayValue, month: monthValue, year: yearValue};
    taskObj.AssignedTo = userInput.AssignedTo;
    taskObj.Status = userInput.Status;
    taskObj.indexOfAssignee = userInput.selectedIndexOfAssignee;
    taskObj.indexOfStatus = userInput.selectedIndexOfStatus;

    const taskHTML = myTaskManager.addTaskHTML(taskObj);
    myTaskManager.addTask(taskObj);
    myTaskManager.renderTask(taskHTML);
}

const createATaskObj = (id) => {
    return {
        ID: id,
        Title: "",
        Description: "",
        AssignedTo: "",
        indexOfAssignee: 0,
        DueDate: {
            day: 0,
            month: 0,
            year: 0
        },
        Status: "",
        indexOfStatus: 0,
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

    get currentID () {
        return this._currentID;
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
        // these ideally should be inline with those in Create Task Form in a global scope
        const assignees = ["Jerry Lin", "Samantha Bijok", "Daniel Dang"];
        const taskStatus = ["To Do", "In Progress", "In Review", "Done"];

        let assigneeHTML = "";
        for (let index = 0; index < assignees.length; index++) {
            assigneeHTML += `<option value="${index + 1}" ${task.indexOfAssignee === index ? "selected": ""}><small>${assignees[index]}</small></option>\n`;
        }
        assigneeHTML += '\n';

        let statusHTML = "";
        for (let index = 0; index < taskStatus.length; index++) {
            statusHTML += `<option value="${index + 1}" ${task.indexOfStatus === index ? "selected": ""}><small>${taskStatus[index]}</small></option>\n`;
        }
        statusHTML += '\n';

        const itemHTML = `<div id="${task.ID}" class="col mb-4">
                            <div class="card text-start shadow border-2">
                                <div id="card-header${task.ID}" class="card-header ${task.cardHeaderBackgrounds[task.Status]}"></div>
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
                                                    ${assigneeHTML}
                                                </select>  
                                            </div>
                                        </li>
                                        <li class="list-group-item p-0">
                                            <div class="d-flex justify-content-between align-items-baseline">
                                                <h6 class="card-subtitle my-1 text-muted"><small>Status</small></h6> 
                                                <select id="friday${task.ID}" onchange="onCardStatusChange(event)" class="custom-select custom-select-sm my-1 border-0 text-muted">
                                                    ${statusHTML}
                                                </select>  
                                            </div>
                                        </li>
                                        <button class="delete-button" type="button">Delete task</button>
                                    </ul>                                                                         
                                </div>
                            </div>
                        </div>`;
    
        return itemHTML;
    }

    updateTaskStatus (taskValues) {
        const storedItem = localStorage.getItem(taskValues.taskKey);
        const taskObj = JSON.parse(storedItem);
        taskObj.Status = taskValues.Status;
        taskObj.indexOfStatus = taskValues.indexOfStatus;
        const taskStr = JSON.stringify(taskObj);
        localStorage.setItem(taskValues.taskKey, taskStr);
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
    myTaskManager.initiateCurrentId(maxId + 1);
}

myTaskManager.addAllTaskItemsFromLocalStorage(allTasks);

