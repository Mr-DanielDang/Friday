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
            task => task.status === status
        );
    }

    addTask (task) {
        task.ID = this._currentID;
        this._currentID += 1;
        this._tasks.push(task);
    }
}

function addTaskItem(item) {
    const itemHTML = `<div id="${item.ID}" class="col mb-4">
                        <div class="card text-start shadow border-2">
                            <div class="card-header ${item.cardHeaderBackgrounds[item.Status]}"></div>
                            <!-- <img src="..." class="card-img-top" alt="..."> -->
                            <div class="card-body">
                                <h5 class="card-title">${item.Title}</h5>
                                <h6 class="card-subtitle mb-2 text-muted"><small>Description</small></h6>
                                <p class="card-text"><textarea class="form-control" rows="3">${item.Description}</textarea></p>
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item p-0">
                                        <div class="d-flex justify-content-between align-items-baseline">
                                            <h6 class="card-text text-muted"><small>Due Date</small></h6>
                                            <input type="date" value="${item.DueDate.year}-${item.DueDate.month}-${item.DueDate.day}">
                                        </div>
                                    </li>
                                    <li class="list-group-item p-0">
                                        <div class="d-flex justify-content-between align-items-baseline">
                                            <h6 class="card-subtitle my-1 text-muted"><small>Assigned To</small></h6>
                                            <select class="custom-select custom-select-sm my-1 border-0 text-muted">
                                                <option value="1" selected><small>${item.AssignedTo}</small></option>
                                                <option value="2"><small>Samantha</small></option>
                                                <option value="3"><small>Daniel</small></option>
                                            </select>  
                                        </div>
                                    </li>
                                    <li class="list-group-item p-0">
                                        <div class="d-flex justify-content-between align-items-baseline">
                                            <h6 class="card-subtitle my-1 text-muted"><small>Status</small></h6> 
                                            <select class="custom-select custom-select-sm my-1 border-0 text-muted">
                                                <option value="1" selected><small>${item.Status}</small></option>
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

    const itemContainer = document.getElementById("card-list");
    itemContainer.innerHTML += itemHTML;
}


const myTaskManager = new TaskManager("group5");


// ----------- this following code snippet is just for verifying the functions of class TaskManger
// and the addTaskItem function. Next, tasks will be created and added into the Task List and the Task Board
// by the user
const newTask = createATaskObj();
newTask.Title = "Add current date in banner";
newTask.Description = "In the Banner, between the heading and the Create Task buttion, add a display of the current date in a user friendly form.";
newTask.DueDate ={day: 24, month: 11, year: 2022};
newTask.AssignedTo = "Samantha";
newTask.Status = "In Progress";
console.log(newTask);

myTaskManager.addTask(newTask);
console.log(myTaskManager.getAllTasks);
console.log(myTaskManager.getTasksWithStatus("In Progress"));

addTaskItem(newTask);
// ------------ END of verifying code


