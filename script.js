const wrapper = document.querySelector(".wrapper");
const menuBtn = document.querySelector(".menu-btn");
const backBtn = document.querySelector(".back-btn");

const toggleScreen = () => {
  wrapper.classList.toggle("show-category");
};

// menuBtn.addEventListener("click", toggleScreen);
backBtn.addEventListener("click", toggleScreen);

const addTaskBtn = document.querySelector(".add-task-btn");
const addTaskForm = document.querySelector(".add-task");
const blackBackDrop = document.querySelector(".black-backdrop");
const addCategoryForm = document.querySelector(".add-category");
const addCategoryBtn = document.querySelector(".add-category-btn");
const cancelCategoryBtn = document.querySelector(".cancel-category-btn");
const cancelBtn = document.querySelector(".cancel-btn");
const addBtn = document.querySelector(".add-btn");
const updateBtn = document.querySelector(".update-btn");
const taskInput = document.querySelector("#task-input");
const categorySelect = document.querySelector("#category-select");

const fixedCategoryImages = {
  work: "briefcase.png",
  health: "healthcare.png",
  study: "study.png",
  shopping: "shopping.png",
  personal: "boy.png",
  coding: "web-design.png",
  education: "education.png",
  fitness: "dumbbell.png",
  finance: "saving.png",
  travel: "travel.jpeg",
  home: "home.png",
};

let categories = [];
let tasks = [];
let selectedCategory = null;
let categoryToDelete = null;
let currentEditTaskId = null;

// Allow Enter key to add or update task
taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();

    if (addBtn.style.display !== "none") {
      addBtn.click();
    } else if (updateBtn.style.display !== "none") {
      updateBtn.click();
    }
  }
});


const toggleAddForm = () => {
  const isInCategory = wrapper.classList.contains("show-category");

  if (isInCategory) {
    addCategoryForm.classList.remove("active");
    addTaskForm.classList.toggle("active");
    categorySelect.parentElement.style.display = "none";
    document.querySelector(".task-form-heading").textContent = "Add Task";

      // Optional: auto-focus task input when adding a task
    setTimeout(() => {
      if (addTaskForm.classList.contains("active")) {
        document.querySelector("#task-input").focus();
      }
    }, 100);
  } 
  else {
    addTaskForm.classList.remove("active");
    addCategoryForm.classList.toggle("active");
    categorySelect.parentElement.style.display = "block";
    document.querySelector(".task-form-heading").textContent = "Add Task to Category";

    // ✅ Auto-focus category input with delay to ensure it's visible
    setTimeout(() => {
      if (addCategoryForm.classList.contains("active")) {
        document.querySelector("#category-name").focus();
      }
    }, 100);
  }
  

    

  taskInput.value = "";
  addBtn.style.display = "inline-block";
  updateBtn.style.display = "none";
  blackBackDrop.classList.toggle("active");
  addTaskBtn.classList.toggle("active");
  
};

addTaskBtn.addEventListener("click", toggleAddForm);
blackBackDrop.addEventListener("click", toggleAddForm);
cancelCategoryBtn.addEventListener("click", toggleAddForm);
cancelBtn.addEventListener("click", toggleAddForm);

addBtn.addEventListener("click", () => {
  const task = taskInput.value.trim();
  const isInCategory = wrapper.classList.contains("show-category");

  if (task === "") {
    alert("Please enter a task");
    return;
  }

  const category = isInCategory
    ? selectedCategory?.title.toLowerCase()
    : categorySelect.value;

  if (!category) {
    alert("Please select a category");
    return;
  }

  const newTask = {
    id: Date.now(),
    task,
    category,
    completed: false,
  };

  tasks.push(newTask);
  taskInput.value = "";
  saveLocal();
  toggleAddForm();
  renderTasks();
});

// edit button to edit task
updateBtn.addEventListener("click", () => {
  const updatedText = taskInput.value.trim();
  if (!updatedText) {
    alert("Task cannot be empty");
    return;
  }
  const taskIndex = tasks.findIndex((t) => t.id === currentEditTaskId);
  if (taskIndex !== -1) {
    tasks[taskIndex].task = updatedText;
    saveLocal();
    renderTasks();
    toggleAddForm();

   const addTaskBtn = document.querySelector(".add-task-btn");
    if (addTaskBtn.classList.contains("active")) {
      addTaskBtn.classList.remove("active"); // Reset (+) button
    }
  }

  saveLocal();
});


const cancelEditBtn = document.querySelector(".cancel-edit-btn");
const editTaskPopup = document.querySelector(".edit-task");
//const addTaskBtn = document.querySelector(".add-task-btn");
const screenBackdrop = document.querySelector(".screen-backdrop");
const editTaskInput = document.querySelector(".edit-task input");

cancelEditBtn.addEventListener("click", () => {
  // 1. Hide edit task popup
  editTaskPopup.style.display = "none";

  // 2. Hide backdrop
  screenBackdrop.style.display = "none";

  // 3. Clear input
  const input = editTaskPopup.querySelector("input");
  if (input) input.value = "";

  // 4. Remove active class from add-task button
  addTaskBtn.classList.remove("active");

  // 5. ✅ Force-reset its styles (in case CSS transition didn't revert)
  addTaskBtn.style.bottom = "1rem";
  addTaskBtn.style.transform = "none";
});


addCategoryBtn.addEventListener("click", () => {
  const categoryInput = document.querySelector("#category-name");
  const name = categoryInput.value.trim().toLowerCase();

  if (!name) {
    alert("Please enter a category name");
    return;
  }

  const isDuplicate = categories.some(
    (cat) => cat.title.toLowerCase() === name
  );

  if (isDuplicate) {
    alert("Category already exists!");
    return;
  }

  const img = fixedCategoryImages[name];

  if (!img) {
    alert(
      "Please use a valid category name like: " +
        Object.keys(fixedCategoryImages).join(", ")
    );
    return;
  }

  const newCategory = {
    title: name.charAt(0).toUpperCase() + name.slice(1),
    img: img,
  };

  categories.push(newCategory);
  categoryInput.value = "";

  saveLocal();
  updateCategorySelect();
  toggleAddForm();
  renderCategories();

});

// to add a category by enter button
document.querySelector("#category-name").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault(); // prevent form submit or accidental refresh
    addCategoryBtn.click(); // trigger the existing add button logic
  }
});


const categoriesContainer = document.querySelector(".categories");
const categoryTitle = document.querySelector(".category-title");
const totalCategoryTasks = document.querySelector(".category-tasks");
const categoryImg = document.querySelector("#category-img");
const totalTasks = document.querySelector(".totalTasks");

const calculateTotal = () => {
  const categoryTasks = tasks.filter(
    (task) =>
      selectedCategory &&
      task.category.toLowerCase() === selectedCategory.title.toLowerCase()
  );
  totalCategoryTasks.innerHTML = `${categoryTasks.length} Tasks`;
  totalTasks.innerHTML = tasks.length;
};

const renderCategories = () => {
  categoriesContainer.innerHTML = "";
  categories.forEach((category) => {
    const categoryTasks = tasks.filter(
      (task) => task.category.toLowerCase() === category.title.toLowerCase()
    );
    const div = document.createElement("div");
    div.classList.add("category");

    div.innerHTML = `
      <div class="left">
        <img src="image/${category.img}" alt="${category.title}">
        <div class="content">
          <h1>${category.title}</h1>
          <p>${categoryTasks.length} Tasks</p>
        </div>
      </div>
      <div class="options">
        <div class="delete-category-icon" title="Delete Category">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </div>
      </div>
    `;

    div.addEventListener("click", () => {
      selectedCategory = category;
      wrapper.classList.add("show-category");
      categoryTitle.innerHTML = category.title;
      categoryImg.src = `image/${category.img}`;
      calculateTotal();
      renderTasks();
    });

    categoriesContainer.appendChild(div);
  });

  attachDeleteHandlers();
};

function attachDeleteHandlers() {
  const deleteIcons = document.querySelectorAll(".delete-category-icon");

  deleteIcons.forEach((icon) => {
    icon.addEventListener("click", function (e) {
      e.stopPropagation();
      e.preventDefault();

      const categoryDiv = icon.closest(".category");
      const title = categoryDiv.querySelector("h1").textContent;

      categoryToDelete = categories.find(
        (cat) => cat.title.toLowerCase() === title.toLowerCase()
      );

      deleteConfirmPopup.classList.add("active");
      blackBackDrop.classList.add("active");
    });
  });
}

const tasksContainer = document.querySelector(".tasks");

const renderTasks = () => {
  tasksContainer.innerHTML = "";
  const categoryTasks = tasks.filter(
    (task) =>
      selectedCategory &&
      task.category.toLowerCase() === selectedCategory.title.toLowerCase()
  );
  if (categoryTasks.length === 0) {
    tasksContainer.innerHTML = `<p class="no-tasks">No tasks for this category</p>`;
  } else {
    categoryTasks.forEach((task) => {
      const div = document.createElement("div");
      div.classList.add("task-wrapper");

      const label = document.createElement("label");
      label.classList.add("task");
      label.setAttribute("for", task.id);

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = task.id;
      checkbox.checked = task.completed;
      checkbox.addEventListener("change", () => {
        const index = tasks.findIndex((t) => t.id === task.id);
        tasks[index].completed = !tasks[index].completed;
        saveLocal();
      });

      label.innerHTML = `
        <span class="checkmark"></span>
        <p>${task.task}</p>
        <div class="actions">
          <div class="edit" title="Edit Task">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 3.487a2.25 2.25 0 113.182 3.182L6.75 19.963 3 21l1.037-3.75 12.825-12.763z" />
            </svg>
          </div>
          <div class="delete" title="Delete Task">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </div>
        </div>
      `;

      label.prepend(checkbox);
      div.appendChild(label);
      tasksContainer.appendChild(div);

      div.querySelector(".delete").addEventListener("click", () => {
        const index = tasks.findIndex((t) => t.id === task.id);
        tasks.splice(index, 1);
        saveLocal();
        renderTasks();
      });

      div.querySelector(".edit").addEventListener("click", (e) => {
        e.stopPropagation();
        taskInput.value = task.task;
        currentEditTaskId = task.id;
        document.querySelector(".task-form-heading").textContent = "Edit Task";
        addBtn.style.display = "none";
        updateBtn.style.display = "inline-block";
        addTaskForm.classList.add("active");
        blackBackDrop.classList.add("active");
         categorySelect.parentElement.style.display = "none";
          setTimeout(() => taskInput.focus(), 100);
      });
    });
  }

  renderCategories();
  calculateTotal();
};

const saveLocal = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("categories", JSON.stringify(categories));
};

const getLocal = () => {
  const localTasks = JSON.parse(localStorage.getItem("tasks"));
  const localCategories = JSON.parse(localStorage.getItem("categories"));

  if (localTasks) tasks = localTasks;
  if (localCategories) categories = localCategories;

  if (categories.length > 0) {
    selectedCategory = categories[0];
  }
};

const updateCategorySelect = () => {
  categorySelect.innerHTML = "";
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.title.toLowerCase();
    option.textContent = category.title;
    categorySelect.appendChild(option);
  });
};

const deleteConfirmPopup = document.querySelector(
  ".delete-category-confirmation"
);
const confirmDeleteBtn = document.querySelector(".confirm-delete");
const cancelDeleteBtn = document.querySelector(".cancel-delete");

confirmDeleteBtn.addEventListener("click", () => {
  if (categoryToDelete) {
    categories = categories.filter(
      (cat) => cat.title.toLowerCase() !== categoryToDelete.title.toLowerCase()
    );
    tasks = tasks.filter(
      (task) =>
        task.category.toLowerCase() !== categoryToDelete.title.toLowerCase()
    );

    if (
      selectedCategory &&
      selectedCategory.title.toLowerCase() ===
        categoryToDelete.title.toLowerCase()
    ) {
      selectedCategory = categories[0] || null;
      if (!selectedCategory) {
        wrapper.classList.remove("show-category");
      }
    }

    categoryToDelete = null;
    saveLocal();
    renderCategories();
    renderTasks();
    calculateTotal();
  }

  deleteConfirmPopup.classList.remove("active");
  blackBackDrop.classList.remove("active");
});

cancelDeleteBtn.addEventListener("click", () => {
  deleteConfirmPopup.classList.remove("active");
  blackBackDrop.classList.remove("active");
});

getLocal();
updateCategorySelect();
renderCategories();
renderTasks();
calculateTotal();
