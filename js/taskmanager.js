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
                                    <p class="card-text"><textarea class="form-control" rows="3" ${task.taskDisabled === true? "disalbed" : ""}>${task.Description}</textarea></p>
                                    <ul class="list-group list-group-flush">
                                        <li class="list-group-item p-0">
                                            <div class="d-flex justify-content-between align-items-baseline">
                                                <h6 class="card-text text-muted"><small>Due Date</small></h6>
                                                <input type="date" value="${task.DueDate.year}-${task.DueDate.month}-${task.DueDate.day}" ${task.taskDisabled === true? "disalbed" : ""}>
                                            </div>
                                        </li>
                                        <li class="list-group-item p-0">
                                            <div class="d-flex justify-content-between align-items-baseline">
                                                <h6 class="card-subtitle my-1 text-muted"><small>Assigned To</small></h6>
                                                <select class="custom-select custom-select-sm my-1 border-0 text-muted" ${task.taskDisabled === true? "disalbed" : ""}>
                                                    ${assigneeHTML}
                                                </select>  
                                            </div>
                                        </li>
                                        <li class="list-group-item p-0">
                                            <div class="d-flex justify-content-between align-items-baseline">
                                                <h6 class="card-subtitle my-1 text-muted"><small>Status</small></h6> 
                                                <select id="friday${task.ID}" onchange="onCardStatusChange(event)" class="custom-select custom-select-sm my-1 border-0 text-muted" ${task.taskDisabled === true? "disalbed" : ""}>
                                                    ${statusHTML}
                                                </select>  
                                            </div>
                                        </li>
                                        <li class="list-group-item pe-0">
                                            <button id="friday-mark${task.ID}" onclick="onMarkAsDone(event)" class="markTask-button" type="button" ${task.markAsDone == true ? "disabled" : ""}>${task.markAsDone == true ? "Done" : "Mark as done"}</button>
                                            <button id="delete-btn-${task.ID}" onclick="onDeleteTask(event)" type="button" class="delete-button text-danger float-end btn btn-sm rounded bg-white border-1 border-secondary" style="--bs-btn-padding-y: 0.1rem;">Delete Task</button>
                                        </li>                                        
                                    </ul>                                                                         
                                </div>
                            </div>
                        </div>`;
    
        return itemHTML;
    }

    removeTaskHtml(taskId) {
        const taskElement = document.getElementById(`${taskId}`);
        if (taskElement === null) {
            console.log("task element is not found in DOM! exit");
            return;
        }

        if (taskElement.parentNode) {
            taskElement.parentNode.removeChild(taskElement);
        } else {
            console.log("something wrong, a task element must have its parent!");
        }
    }

    removeTask(taskId) {
        const indexOfTask = this._tasks.findIndex((nextTask) => nextTask.ID === Number(taskId));
        if (indexOfTask === -1) {
            console.log(`can't find a task object with id: ${taskId} ! exit`);
            return;
        }

        console.log(`removing task object with id: friday${taskId} at index ${indexOfTask} ...`);
        this._tasks.splice(indexOfTask, 1);
        localStorage.removeItem(`friday${taskId}`);
    }

    disableEditingOfATask (taskId) {
        const taskDescription = document.querySelector(`#${taskId} textarea`);
        const taskDate = document.querySelector(`#${taskId} input[type="date"]`);
        // the first select element is for assignees
        const taskAssignedTo = document.querySelector(`#${taskId} select`);
        const taskStatus = document.querySelector(`#${taskId} select[id="friday${taskId}"]`);

        taskDescription.disabled = true;
        taskDate.disabled = true;
        taskAssignedTo.disabled = true;
        taskStatus.disabled = true;
    }

    updateTaskStatus (taskValues) {
        const storedItem = localStorage.getItem(taskValues.taskKey);
        const taskObj = JSON.parse(storedItem);
        taskObj.Status = taskValues.Status;
        taskObj.indexOfStatus = taskValues.indexOfStatus;
        taskObj.taskDisabled = taskValues.taskDisabled;
        taskObj.markAsDone = taskValues.markAsDone;
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
    
    initiateCurrentId (id) {
        this._currentID = id;
    }
}

export {TaskManager};