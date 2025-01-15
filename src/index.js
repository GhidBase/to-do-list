class ProjectList {
    static projects = [];
    static localProjectList;
    static defaultProjectToLoad = 0;
    static lastActiveProject = 0;
    
    
    //#region PROJECT ADD PANEL START
    // 
    static projectAddPanel = document.createElement("div");
    static {
        ProjectList.projectAddPanel.classList.add("edit-panel");
        ProjectList.projectAddPanel.innerHTML = editPanelTemplate;
    }

    static form = ProjectList.projectAddPanel.querySelector(".edit-panel-actual");
    static formTitle = ProjectList.form.querySelector(".title");
    static formDescription = ProjectList.form.querySelector(".description");
    static formPriority = ProjectList.form.querySelector(".priority");
    static formCancelButton = ProjectList.form.querySelector(".cancel-button");
    static {
        ProjectList.form.addEventListener('submit', function(event) {
            event.preventDefault();
            ProjectList.addProject(ProjectList.formTitle.value, ProjectList.formDescription.value, ProjectList.formPriority.value);
            ProjectList.formTitle.value = "";
            ProjectList.formDescription.value = "";
            ProjectList.formPriority.value = "";
            ProjectList.closeProjectAddPanel();
        })

        ProjectList.formCancelButton.addEventListener("click",() => ProjectList.closeProjectAddPanel())   
    }
    // #endregion PROJECT EDIT PANEL END
    

    // #region TODO ADD PANEL START
    static toDoAddPanel = document.createElement("div");
    static {
        ProjectList.toDoAddPanel.classList.add("edit-panel");
        ProjectList.toDoAddPanel.innerHTML = editPanelTemplate;   
    }

    static toDoAddHeader = ProjectList.toDoAddPanel.querySelector("h1");
    static {
        ProjectList.toDoAddHeader.textContent = "New To-Do";
    }

    static toDoForm = ProjectList.toDoAddPanel.querySelector(".edit-panel-actual");
    static toDoFormTitle = ProjectList.toDoForm.querySelector(".title");
    static toDoDescription = ProjectList.toDoForm.querySelector(".description");
    static toDoPriority = ProjectList.toDoForm.querySelector(".priority");
    static toDoFormCancelButton = ProjectList.toDoForm.querySelector(".cancel-button");
    static {
        ProjectList.toDoForm.addEventListener('submit', function(event) {
            event.preventDefault();
            ProjectList.projects[ProjectList.lastActiveProject].addToDo(ProjectList.toDoFormTitle.value, ProjectList.toDoDescription.value, ProjectList.toDoPriority.value);
            ProjectList.toDoFormTitle.value = "";
            ProjectList.toDoDescription.value = "";
            ProjectList.toDoPriority.value = "";
            ProjectList.closeToDoAddPanel();
        })

        console.log("TEST");
        ProjectList.toDoFormCancelButton.addEventListener("click",() => ProjectList.closeToDoAddPanel())   
        console.log("TEST");
    }
    // 
    //#endregion ToDo EDIT PANEL END


    // #region TODO Edit PANEL START
    static toDoEditPanel = document.createElement("div");
    static {
        ProjectList.toDoEditPanel.classList.add("edit-panel");
        ProjectList.toDoEditPanel.innerHTML = editPanelTemplate;   
    }

    static toDoEditHeader = ProjectList.toDoEditPanel.querySelector("h1");
    

    static toDoEditForm = ProjectList.toDoEditPanel.querySelector(".edit-panel-actual");
    static toDoEditFormTitle = ProjectList.toDoEditForm.querySelector(".title");
    static toDoEditDescription = ProjectList.toDoEditForm.querySelector(".description");
    static toDoEditPriority = ProjectList.toDoEditForm.querySelector(".priority");
    static toDoEditFormCancelButton = ProjectList.toDoEditForm.querySelector(".cancel-button");
    static {
        ProjectList.toDoEditForm.addEventListener('submit', function(event) {
            event.preventDefault();
            ProjectList.projects[ProjectList.lastActiveProject].addToDo(ProjectList.toDoFormTitle.value, ProjectList.toDoDescription.value, ProjectList.toDoPriority.value, ProjectList.projects[ProjectList.lastActiveProject].toDos.length);
            ProjectList.toDoFormTitle.value = "";
            ProjectList.toDoDescription.value = "";
            ProjectList.toDoPriority.value = "";
            ProjectList.closeToDoEditPanel();
            ProjectList.toDoEditHeader.textContent = "Edit To-Do: " + this.toDoEditFormTitle;
        })

        ProjectList.toDoEditFormCancelButton.addEventListener("click",() => ProjectList.closeToDoEditPanel())   
    }
    // 
    //#endregion ToDo EDIT PANEL END

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
                let project = new Project(element.title, element.description, element.priority, element.toDos, index, element.completion);
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
        const newProject = new Project(title, description, priority, [], ProjectList.projects.length, false);
        const newProjectIndex = this.projects.push(newProject) - 1;
        newProject.setArrayIndex(newProjectIndex);
        ProjectList.saveToLocalStorage();
        ProjectList.renderProjectList();
        return newProject;
    }

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
        addProjectButton.addEventListener("click", () => ProjectList.showProjectAddPanel())
        addProjectButton.innerHTML = addProjectTemplate;
        projectsNode.appendChild(addProjectButton);
    }

    static showProjectAddPanel() {
        document.body.appendChild(ProjectList.projectAddPanel);
    }

    static closeProjectAddPanel() {
        document.body.removeChild(ProjectList.projectAddPanel)
    }

    static closeToDoAddPanel() {
        document.body.removeChild(ProjectList.toDoAddPanel)
    }

    static showToDoAddPanel() {
        console.log("showAddPanel");
        document.body.appendChild(ProjectList.toDoAddPanel);
    }

    static showToDoEditPanel(indexOfToDo) {
        console.log("showEditPanel");
        document.body.appendChild(ProjectList.toDoEditPanel);
        let referenceToDo = ProjectList.projects[this.lastActiveProject].toDos[indexOfToDo];
        ProjectList.toDoEditHeader.textContent = "Edit To-Do: ";
        ProjectList.toDoEditPanel.querySelector(".title").value = referenceToDo.title;
        console.log("EDIT: " + referenceToDo.title)
        ProjectList.toDoEditPanel.querySelector(".description").textContent = referenceToDo.description;
        ProjectList.toDoEditPanel.querySelector(".priority").value = Number(referenceToDo.priority);
    }

    static closeToDoEditPanel() {
        document.body.removeChild(ProjectList.toDoEditPanel)
    }
}

class Project {
    constructor(title, description, priority, toDos = [], arrayIndex, completion) {
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.toDos = toDos;
        this.arrayIndex = arrayIndex;
        this.completion = completion;
        this.initializeToDoList();
        this.rootDomNode;
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
        let newToDo = new ToDo(title, description, priority, this.arrayIndex, false, this.toDos.length);
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
            return new ToDo(element.title, element.description, element.priority, this.arrayIndex, element.completion);
        })
    }

    renderProject(index) {
        this.arrayIndex = index;
        const tempContainer = document.createElement("div");
        this.rootDomNode = tempContainer;
        tempContainer.innerHTML = projectTemplate;
        tempContainer.querySelector("h2").textContent = this.title;
        tempContainer.querySelector(".description").textContent = this.description;
        tempContainer.querySelector(".priority").textContent = "Priority: " + this.priority;
        tempContainer.querySelector(".checkbox-gap").checked = this.completion;
        tempContainer.querySelector(".checkbox-gap").addEventListener("change", () => this.toggleCompletion())
        
        tempContainer.querySelector(".view-button").addEventListener("click", () => this.renderToDoList())
        tempContainer.querySelector(".delete-button").addEventListener("click", () => ProjectList.removeProject(this.arrayIndex))

        this.renderProjectCompletion();

        projectsNode.appendChild(tempContainer);
    }

    renderToDoList() {
        this.clearToDoRenders();
        this.toDos.forEach((element, index) => element.renderToDo(index))
        ProjectList.lastActiveProject = this.arrayIndex;

        const addToDoButton = document.createElement("div");
        addToDoButton.classList.add("add-to-do-button");
        addToDoButton.addEventListener("click", () => ProjectList.showToDoAddPanel())
        addToDoButton.innerHTML = addToDoTemplate;
        toDosNode.appendChild(addToDoButton);
    }

    clearToDoRenders() {
        toDosNode.innerHTML = "";
        const toDosHeader = document.createElement("h1");
        toDosHeader.textContent = "To-Dos";
        toDosNode.appendChild(toDosHeader);
    }

    toggleCompletion() {
        if (this.completion == false || this.completion == null || this.completion == undefined) {
            this.completion = true;
        }
        else {
            this.completion = false;
        }
        this.renderProjectCompletion();
        console.log("completion status now " + this.completion);
        ProjectList.saveToLocalStorage();
    }

    renderProjectCompletion() {
        if (this.completion == false || this.completion == null || this.completion == undefined) {
            this.rootDomNode.querySelector("h2").textContent = this.title;
        }
        else {
            this.rootDomNode.querySelector("h2").textContent = this.title + " (Completed)";
        }
    }
}

class ToDo {
    constructor(title, description, priority, projectIndex, completion, index) {
        this.title = title,
        this.description = description,
        this.priority = priority,
        this.projectIndex = projectIndex,
        this.completion = completion,
        this.rootDomNode,
        this.index = index
    }

    updateDetails(title, description, priority) {
        this.title = title;
        this.description = description;
        this.priority = priority;
    }

    renderToDo(index) {
        const tempContainer = document.createElement("div");
        this.index = index;
        this.rootDomNode = tempContainer;
        tempContainer.innerHTML = toDoTemplate;
        tempContainer.querySelector("h2").textContent = this.title;
        tempContainer.querySelector(".description").textContent = this.description;
        tempContainer.querySelector(".priority").textContent = "Priority: " + this.priority;
        tempContainer.querySelector(".checkbox-gap").checked = this.completion;
        tempContainer.querySelector(".checkbox-gap").addEventListener("change", () => this.toggleCompletion())
        tempContainer.querySelector(".edit-button").addEventListener("click", () => {
            ProjectList.showToDoEditPanel(index);
        });

        tempContainer.querySelector(".delete-button").addEventListener("click", () => ProjectList.projects[this.projectIndex].removeToDo(this));
        toDosNode.appendChild(tempContainer);

        this.renderToDoCompletion()
    }

    toggleCompletion() {
        if (this.completion == false || this.completion == null || this.completion == undefined) {
            this.completion = true;
        }
        else {
            this.completion = false;
        }
        this.renderToDoCompletion();
        console.log("completion status now " + this.completion);
        ProjectList.saveToLocalStorage();
    }

    renderToDoCompletion() {
        if (this.completion == false || this.completion == null || this.completion == undefined) {
            this.rootDomNode.querySelector("h2").textContent = this.title;
        }
        else {
            this.rootDomNode.querySelector("h2").textContent = this.title + " (Completed)";
        }
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