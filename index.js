class TaskList {
    constructor() {
        this.textField = document.querySelector('.task__input-field') //объявляем инпут из которого получем введённое значение
        this.createBtn = document.querySelector('.task__input-btn') // объявляем кнопку добавления задачи
        this.tasksBlock = document.querySelector('.todo__list') // объявляем блок для добавления задач
        this.statusBar = document.querySelector('.status__bar') // объявляем блок выбора статуса задачи
        this.statusBar.addEventListener('click', this.selectStatus);
        this.createBtn.addEventListener('click', this.createTask.bind(this)); // вешаем обработчик на кнопку добавления задачи
        this.idCounter = localStorage.getItem('idCounter');

        if (localStorage.getItem('idCounter') !== undefined) { //проверяем на наличие задач в localstorage
            let keys = Object.keys(localStorage);
            for (let key of keys) {
                let taskTemplate = (JSON.parse(localStorage.getItem(key))).template;
                if (taskTemplate !== undefined) {
                    this.tasksBlock.insertAdjacentHTML('beforeend', taskTemplate);
                }
            }
            let allTasksBtns = document.querySelectorAll('.complete-btn');
            for (let btn of allTasksBtns) {
                btn.addEventListener('click', this.finishTask.bind(this));
            }
            let allTasksDeleteBtns = document.querySelectorAll('.delete-btn');
            for (let btn of allTasksDeleteBtns) {
                btn.addEventListener('click', this.deleteTask.bind(this));
            }
        } //при наличии задач получем из объекта задачи свойство template и на его основе выстраиваем блоки для каждой имеющейся задачи

    }


    createTask() {
        this.idCounter++;
        localStorage.setItem('idCounter', this.idCounter)
        let taskText = this.textField.value; //получем значение их инпут
        if (!taskText) { //проверяем, что инпут не пустой
            return
        } else {
            const task = new Task(taskText, this.idCounter, 'active') //создаём новый объект класса Task
            this.tasksBlock.insertAdjacentHTML('beforeend', task.getTemplate()) //добавляем шаблон задачи в блок
            document.getElementById(`delete${task.id}`).addEventListener('click', this.deleteTask.bind(this));
            document.getElementById(`done${task.id}`).addEventListener('click', this.finishTask.bind(this));
            localStorage.setItem(`key${task.id}`, JSON.stringify(task)) //сохраняем объект класса в localStorage

        }
        this.textField.value = null; //обнуляем поле инпута
    }


    finishTask(e) {
        let text = JSON.parse(localStorage.getItem(`key${e.target.parentNode.id}`)).text
        const completedTask = new Task(text, e.target.parentNode.id, 'completed')
        let completedTaskTemplate = completedTask.getTemplate();
        localStorage.removeItem(`key${e.target.parentNode.id}`)
        e.target.parentNode.remove();
        localStorage.setItem(`key${completedTask.id}`, JSON.stringify(completedTask))
        this.tasksBlock.insertAdjacentHTML('beforeend', completedTaskTemplate)
        let allTasksDeleteBtns = document.querySelectorAll('.delete-btn');
        document.getElementById(`delete${completedTask.id}`).addEventListener('click', this.deleteTask.bind(this));
    }

    deleteTask(e) {
        localStorage.removeItem(`key${e.target.parentNode.id}`)
        e.target.parentNode.remove();
    }


    selectStatus(e) {
        let completedTasks = document.querySelectorAll('.completed');
        let activeTasks = document.querySelectorAll('.active');
        let statusButtons = document.querySelectorAll('.status__bar-btn');
        for (let btn of statusButtons) {
            if (btn.classList.contains('bar-btn-active')) {
                btn.classList.remove('bar-btn-active')
            }
        }
        e.target.classList.add('bar-btn-active');

        if (e.target.classList.contains('tasks__active')) {
            for (let task of completedTasks) {
                task.style.display = "none"
            }
            for (let task of activeTasks) {
                task.style.display = "flex"
            }
        } else if (e.target.classList.contains('tasks__completed')) {
            for (let task of activeTasks) {
                task.style.display = "none"
            }
            for (let task of completedTasks) {
                task.style.display = "flex"
            }
        } else {
            for (let task of activeTasks) {
                task.style.display = "flex"
            }
            for (let task of completedTasks) {
                task.style.display = "flex"
            }
        }
    }
}

class Task {
    constructor(text, id, status) {
        this.text = text
        this.id = id
        this.status = status
    }

    getTemplate() {
        if (this.status == 'active') {
            this.template = `<div class="todo__list-item ${this.status}" id="${this.id}"><p class="task__item-text">${this.text}</p><button class="complete-btn">Done</button><button class="delete-btn">Delete</button></div>`;
            return `<div class="todo__list-item ${this.status}" id="${this.id}"><p class="task__item-text">${this.text}</p><button id="done${this.id}" class="complete-btn">Done</button><button id="delete${this.id}" class="delete-btn">Delete</button></div>`;
        } else {
            this.template = `<div class="todo__list-item ${this.status}" id="${this.id}"><p class="task__item-text">${this.text}</p><button class="delete-btn">Delete</button></div>`;
            return `<div class="todo__list-item ${this.status}" id="${this.id}"><p class="task__item-text">${this.text}</p><button id="delete${this.id}"class="delete-btn">Delete</button></div>`
        }
    }
}

loadApp()


function loadApp() {
    const list = new TaskList()

}




// let taskIndex = localStorage.getItem('taskIndex');;

// statusBar.addEventListener("click", changeStatus);