class ProjectList {
    static projects = [];
    static localProjectList;
    static defaultProjectToLoad = 0;
    static lastActiveProject = 0;
    static projectEditPanel = document.createElement("div");
    
    static {
        ProjectList.projectEditPanel.classList.add("edit-panel");
        ProjectList.projectEditPanel.innerHTML = editPanelTemplate;
    }

    static form = ProjectList.projectEditPanel.querySelector(".edit-panel-actual");
    static {
        ProjectList.form.addEventListener('submit', function(event) {
            event.preventDefault();
            ProjectList.closeProjectEditPanel();
        })
    }
    static formTitle = ProjectList.form.querySelector(".title");
    static formDescription = ProjectList.form.querySelector(".description");
    static formPriority = ProjectList.form.querySelector(".priority");
        

    static getLocalStorage() {
        this.localProjectList = localStorage.getItem("projects");
        return this.localProjectList;
    }

    static saveToLocalStorage() {
        console.log("saving to local storage");
        const serializedProjects  = JSON.stringify(this.projects);
        localStorage.setItem("projects", serializedProjects);
        this.localProjectList = serializedProjects;
    }

    static initializeProjectList() {
        console.log("\ninitializing project list object")
        if (ProjectList.getLocalStorage()) {
            this.projects = JSON.parse(this.localProjectList);
            this.projects = this.projects.map((element, index) => {
                console.log(element);
                let project = new Project(element.title, element.description, element.priority, element.toDos, index);
                return project;
            })
        ProjectList.renderProjectList();
        if (ProjectList.projects[0] == undefined) {
            ProjectList.addProject("Default project", "", 5);
        }
        ProjectList.projects[ProjectList.defaultProjectToLoad].renderToDoList();
        
        }
        else {
            ProjectList.saveToLocalStorage();
        }
    }
    
    static addProject(title, description, priority) {
        const newProject = new Project(title, description, priority);
        const newProjectIndex = this.projects.push(newProject) - 1;
        newProject.setArrayIndex(newProjectIndex);
        ProjectList.saveToLocalStorage();
        ProjectList.renderProjectList();
        return newProject;
    }

    // static removeProject(projectToRemove) {
    //     console.log("Removing project at index " + projectToRemove.arrayIndex)
    //     if (projectToRemove = ProjectList.lastActiveProject) {
    //         projectToRemove.clearToDoRenders()
    //     }
    //     this.projects = this.projects.filter((project) => project != projectToRemove);
    //     ProjectList.saveToLocalStorage();
    //     ProjectList.renderProjectList();
    // }

    static removeProject(arrayIndex) {
        console.log("deleting item at index " + arrayIndex);
        if (ProjectList.lastActiveProject == arrayIndex) {
            ProjectList.projects[arrayIndex].clearToDos();
            ProjectList.projects[arrayIndex].renderToDoList();
        }

        ProjectList.projects = ProjectList.projects.filter((project) => ProjectList.projects[arrayIndex] != project);
        ProjectList.saveToLocalStorage();
        ProjectList.renderProjectList();
    }

    static editProject(projectToEdit, title, description, priority) {
        projectToEdit.updateDetails(title, description, priority);
        ProjectList.saveToLocalStorage();
        ProjectList.renderProjectList();
    }

    static clearProjects() {
        if (localStorage)
        localStorage.removeItem("projects");
        this.localProjectList = [];
        this.projects = [];
    }

    static renderProjectList() {
        projectsNode.innerHTML = "";
        const projectsHeader = document.createElement("h1");
        projectsHeader.textContent = "Projects";
        projectsNode.appendChild(projectsHeader);
        this.projects.forEach((project, index) => {project.renderProject(index)});

        const addProjectButton = document.createElement("div");
        addProjectButton.classList.add("add-project-button");
        addProjectButton.addEventListener("click", () => ProjectList.showProjectEditPanel())
        addProjectButton.innerHTML = addProjectTemplate;
        projectsNode.appendChild(addProjectButton);
    }

    static showProjectEditPanel() {
        document.body.appendChild(ProjectList.projectEditPanel);
    }

    static closeProjectEditPanel() {
        document.body.removeChild(ProjectList.projectEditPanel)
    }
}

class Project {
    constructor(title, description, priority, toDos = [], arrayIndex) {
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.toDos = toDos;
        this.arrayIndex = arrayIndex;
        this.initializeToDoList();
    }

    setArrayIndex(value) {
        this.arrayIndex = value;
    }

    updateDetails(title, description, priority) {
        this.title = title;
        this.description = description;
        this.priority = priority;
    }

    addToDo(title, description, priority) {
        console.log("addToDo arrayIndex = " + this.arrayIndex)
        let newToDo = new ToDo(title, description, priority, this.arrayIndex);
        this.toDos.push(newToDo);
        ProjectList.saveToLocalStorage();
        this.renderToDoList();
    }

    editToDo(toDoToEdit, title, description, priority) {
        toDoToEdit.updateDetails(title, description, priority);
        ProjectList.saveToLocalStorage();
        this.renderToDoList();
    }

    removeToDo(toDoToRemove) {
        console.log("Removing " + toDoToRemove)
        this.toDos = this.toDos.filter((element) => element != toDoToRemove);
        ProjectList.saveToLocalStorage();
        this.renderToDoList();
    }

    clearToDos() {
        this.toDos = [];
        ProjectList.saveToLocalStorage();
    }

    initializeToDoList() {
        this.toDos = this.toDos.map((element) => {
            return new ToDo(element.title, element.description, element.priority, this.arrayIndex);
        })
    }

    renderProject(index) {
        this.arrayIndex = index;
        const tempContainer = document.createElement("div");
        tempContainer.innerHTML = projectTemplate;
        tempContainer.querySelector("h2").textContent = this.title;
        tempContainer.querySelector(".description").textContent = this.description;
        tempContainer.querySelector(".priority").textContent = "Priority: " + this.priority;
        
        tempContainer.querySelector(".view-button").addEventListener("click", () => this.renderToDoList())
        tempContainer.querySelector(".delete-button").addEventListener("click", () => ProjectList.removeProject(this.arrayIndex))

        projectsNode.appendChild(tempContainer);
    }

    renderToDoList() {
        this.clearToDoRenders();
        this.toDos.forEach((element) => element.renderToDo())
        ProjectList.lastActiveProject = this.arrayIndex;

        const addToDoButton = document.createElement("div");
        addToDoButton.classList.add("add-to-do-button");
        addToDoButton.addEventListener("click", () => ProjectList.projects[ProjectList.lastActiveProject].addToDo())
        addToDoButton.innerHTML = addToDoTemplate;
        toDosNode.appendChild(addToDoButton);
    }

    clearToDoRenders() {
        toDosNode.innerHTML = "";
        const toDosHeader = document.createElement("h1");
        toDosHeader.textContent = "To-Dos";
        toDosNode.appendChild(toDosHeader);
    }
}

class ToDo {
    constructor(title, description, priority, projectIndex) {
        this.title = title,
        this.description = description,
        this.priority = priority,
        this.projectIndex = projectIndex
    }

    updateDetails(title, description, priority) {
        this.title = title;
        this.description = description;
        this.priority = priority;
    }

    renderToDo() {
        const tempContainer = document.createElement("div");
        tempContainer.innerHTML = toDoTemplate;
        tempContainer.querySelector("h2").textContent = this.title;
        tempContainer.querySelector(".description").textContent = this.description;
        tempContainer.querySelector(".priority").textContent = "Priority: " + this.priority;

        tempContainer.querySelector(".delete-button").addEventListener("click", () => ProjectList.projects[this.projectIndex].removeToDo(this));
        toDosNode.appendChild(tempContainer);
    }
}

window.ProjectList = ProjectList;



import "./css/styles.css";

const projectsNode = document.querySelector("#projects");
const toDosNode = document.querySelector("#to-dos");
import projectTemplate from "./templates/project.html";
import toDoTemplate from "./templates/to-do.html";
import addProjectTemplate from "./templates/add-project.html";
import addToDoTemplate from "./templates/add-to-do.html";
import editPanelTemplate from "./templates/edit-project-window.html";

ProjectList.initializeProjectList();
ProjectList.showProjectEditPanel();