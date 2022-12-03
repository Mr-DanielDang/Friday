import { TaskManager } from "./taskmanager.js";

const clearInputsOfCreateTaskForm = () => {
    document.getElementById("InputTitle").value = "";
    document.getElementById("InputName").selectedIndex = 0;
    document.getElementById("InputDesc").value = "";        
    document.getElementById("InputDate").value = "";
    document.getElementById("InputStatus").selectedIndex = 0;       
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
    const td = new Date();
    // set minimum date as today
    const [day, month, year] = td.toLocaleDateString('en-au').split('/');
    document.getElementById("InputDate").setAttribute('min', `${year}-${month}-${day}`);
    
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
}

const closeCreateTaskForm = () => {
    document.getElementById("create-task").style.display = 'none';
    clearInputsOfCreateTaskForm();
}

function validateTaskForm(event) { 
    const inputTitle = document.getElementById("InputTitle");
    const inputName = document.getElementById("InputName");    
    const inputDesc = document.getElementById("InputDesc");        
    const inputDate = document.getElementById("InputDate");
    const inputStatus = document.getElementById("InputStatus");
    const userInput = {};
    let thereIsError = false;

    // Name -> Not Empty and longer than 8 characters
    if ((inputTitle.validity.valid) && (inputTitle.value.length > 8)) {
        userInput.Title = inputTitle.value;
        inputTitle.classList.add('valid');
    } else {
        // display an appropriate error message
        showError("InputTitle");
        thereIsError = true;
    }

    // AssignedTo -> Not Empty and longer than 8 characters
    if ((inputName.value !== "0")  && (inputName.options[inputName.selectedIndex].text.length > 8)){
        userInput.AssignedTo = inputName.options[inputName.selectedIndex].text;
        userInput.selectedIndexOfAssignee = inputName.selectedIndex > 0? inputName.selectedIndex - 1 : 0; 
        inputName.classList.add("valid");
    } else {
        // display an appropriate error message
        showError("InputName");
        thereIsError = true;
    }

    // Description -> Not Empty and longer than 15 characters
    if ((inputDesc.validity.valid) && (inputDesc.value.length > 15)) {
        userInput.Description = inputDesc.value;
        inputDesc.classList.add("valid");
    } else {
        // display an appropriate error message
        showError("InputDesc");
        thereIsError = true;
    }

    // DueDate -> Not Empty and not less than current date
    if (inputDate.validity.valid) {
        userInput.dueDate = inputDate.value;
        inputDate.classList.add("valid");
    } else {
        // display an appropriate error message
        showError("InputDate");
        thereIsError = true;
    }

    if (inputStatus.value !== "0") {
        userInput.Status = inputStatus.options[inputStatus.selectedIndex].text;
        userInput.selectedIndexOfStatus = inputStatus.selectedIndex > 0? inputStatus.selectedIndex - 1 : 0;
        inputStatus.classList.add("valid");
    } else {
        // display an appropriate error message
        showError("InputStatus");        
        thereIsError = true;
    }

    if (thereIsError === true) {
        // prevent the form from being sent by canceling the event
        event.preventDefault();
        return;
    }

    // prevent the form from being sent by canceling the event
    event.preventDefault();
    createATask(userInput);
    clearInputsOfCreateTaskForm();
}

window.onCardStatusChange = function (event) {
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

window.onMarkAsDone = function (event) {
    event.preventDefault();
    const cardHeaderBackgrounds = {
        "To Do": "bg-info",
        "In Progress": "bg-warning",
        "In Review": "bg-primary",
        "Done": "bg-success"
    };
    const taskMarkId = event.target.id;
    const taskId = taskMarkId.substring(11);
    const taskStatus = document.getElementById(`friday${taskId}`);
    taskStatus.selectedIndex = 3;

    const taskStatusValue = taskStatus.options[taskStatus.selectedIndex].text;
    const targetCard = document.getElementById(`card-header${taskId}`);
    targetCard.classList.remove("bg-info");
    targetCard.classList.remove("bg-warning");
    targetCard.classList.remove("bg-primary");
    targetCard.classList.remove("bg-success");
    targetCard.classList.add(cardHeaderBackgrounds[taskStatusValue]);

    const taskValues = {
        taskKey: `friday${taskId}`,
        Status: taskStatusValue,
        indexOfStatus: taskStatus.selectedIndex,
        markAsDone: true,
        taskDisabled: true
    };

    myTaskManager.updateTaskStatus(taskValues);
    const markAsDoneBtn = document.getElementById(taskMarkId);
    const parentNode = markAsDoneBtn.parentNode;
    const doneBtn = document.createElement(`button`);
    doneBtn.setAttribute("class", "taskDone-button");
    doneBtn.setAttribute("type", "button");
    doneBtn.setAttribute("disabled", "");
    doneBtn.innerText = "Done";
    parentNode.replaceChild(doneBtn, markAsDoneBtn);
    myTaskManager.disableEditingOfATask(taskId);
}

window.onDeleteTask = function (event) {
    event.preventDefault();
    const deleteBtnId = event.target.id;
    // grap the number only from. e.g. delete-btn-05
    const taskId = deleteBtnId.substring(11);

    myTaskManager.removeTask(taskId);
    myTaskManager.removeTaskHtml(taskId);
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
        markAsDone: false,
        taskDisabled: false,
        cardHeaderBackgrounds: {
            "To Do": "bg-info",
            "In Progress": "bg-warning",
            "In Review": "bg-primary",
            "Done": "bg-success"
        }
    }
};

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

const currentDate = new Date();
const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
document.getElementById("current-date").innerHTML = currentDate.toLocaleDateString('en-au', options);

const createTaskBtn = document.getElementById("createTask");
createTaskBtn.onclick = showCreateTaskForm;
const resetTaskBtn = document.getElementById("resetTask");
resetTaskBtn.onclick = resetCreateTaskForm;
const closeTaskForm = document.getElementById("closeTask");
closeTaskForm.onclick = closeCreateTaskForm;
const submitTask = document.getElementById("submitTask");
submitTask.addEventListener("click", validateTaskForm);

const myTaskManager = new TaskManager("group5");
myTaskManager.loadStoredTasks();

const allTasks = myTaskManager.getAllTasks;
const idArray = allTasks.map(task => task.ID);
if (idArray.length > 0) {
    const maxId = Math.max(...idArray);
    myTaskManager.initiateCurrentId(maxId + 1);
}

myTaskManager.addAllTaskItemsFromLocalStorage(allTasks);