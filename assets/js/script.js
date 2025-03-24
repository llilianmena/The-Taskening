let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;


function generateTaskId() {

    const id = nextId++;
  localStorage.setItem("nextId", JSON.stringify(nextId));
  return id;

}


function createTaskCard(task) {

    const deadline = dayjs(task.deadline);
    const now = dayjs();
    let bgColor = "bg-white"; 

    if (task.status === "to-do") {
      bgColor = "bg-danger"; 
    } 


    if (task.status === "in-progress") {
        bgColor = "bg-warning"; 
      } 

      if (task.status === "done") {
        bgColor = "bg-success"; 
      } 

    if (deadline.diff(now, "day") <= 2) {
      bgColor = "bg-warning"; 
    }

    return `
    <div class="card task-card ${bgColor}" data-id="${task.id}">
      <div class="card-body">
        <h5 class="card-title">${task.title}</h5>
        <p class="card-text">${task.description}</p>
        <small class="text-muted">Due: ${deadline.format("YYYY-MM-DD")}</small>
        <button class="btn btn-danger btn-sm mt-2 delete-task">Delete</button>
      </div>
    </div>`;


}



function renderTaskList() {

    const todolist = $("#todo-cards")
    const inProgresslist = $("#in-progress-cards");
    const donelist = $("#done-cards");

    $("#todo-cards, #in-progress-cards, #done-cards").empty();



  taskList.forEach((task) => {
     console.log(task.status)

    const cardHTML = createTaskCard(task);
    if (task.status === "to-do") {
      todolist.append(cardHTML);
    }  if (task.status === "in-progress") {
      inProgresslist.append(cardHTML);
    }  if (task.status === "done") {
      donelist.append(cardHTML);
    }
  });

  makeCardsDraggable();  
}

function makeCardsDraggable() {

 $(".task-card").draggable({
    revert: "invalid",
    stack: ".task-card",
 
  });

}




function handleAddTask(event){

    event.preventDefault();
    const title = $("#task-title").val().trim();
    const description = $("#task-desc").val().trim();
    const deadline = $("#task-deadline").val();
  
    if (!title || !deadline) return alert("Title and deadline are required!");

    if (dayjs(deadline).isBefore(dayjs(), "day")) {
    return alert("Deadline must be a future date!");
}



    const newTask = {
      id: generateTaskId(),
      title,
      description,
      deadline,
      status: "to-do",
    };
  
    taskList.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    $("#formModal").modal("hide");
    renderTaskList();

}



function handleDeleteTask(event){

    const taskId = $(event.target).closest(".task-card").data("id");

  taskList = taskList.filter((task) => task.id != taskId);
  localStorage.setItem("tasks", JSON.stringify(taskList));
  renderTaskList();

}



function handleDrop(event, ui) {

const taskId = ui.helper.data("id"); 
const newStatus = $(event.target).closest(".card").attr("id").replace("-cards", ""); 
  
  

  taskList = taskList.map((task) =>
    task.id === taskId ? { ...task, status: newStatus } : task
  );


  localStorage.setItem("tasks", JSON.stringify(taskList));
  renderTaskList();
}




$(document).ready(function () {

    renderTaskList();

  $("#task-deadline").datepicker();
  $("#add-task-form").on("submit", handleAddTask);
  $(document).on("click", ".delete-task", handleDeleteTask);

  $(".card-body").droppable({
    accept: ".task-card",
    drop: handleDrop

  });

});
