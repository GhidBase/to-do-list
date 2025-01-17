import { format, formatDistance, formatRelative, subDays, parseISO, isValid } from 'date-fns';

class ProjectList {
    static projects = [];
    static localProjectList;
    static defaultProjectToLoad = 0;
    static lastActiveProject = 0;
    static lastEditedToDo;
    static lastEditedProject;
    
    
    
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
    static formDate = ProjectList.form.querySelector(".date");
    static formCancelButton = ProjectList.form.querySelector(".cancel-button");
    static {
        ProjectList.form.addEventListener('submit', function(event) {
            event.preventDefault();
            ProjectList.addProject(ProjectList.formTitle.value, ProjectList.formDescription.value, ProjectList.formPriority.value, ProjectList.formDate.value);
            ProjectList.formTitle.value = "";
            ProjectList.formDescription.value = "";
            ProjectList.formPriority.value = "";
            ProjectList.closeProjectAddPanel();
        })

        ProjectList.formCancelButton.addEventListener("click",() => ProjectList.closeProjectAddPanel())   
    }
    // #endregion PROJECT ADD PANEL END


    //#region PROJECT EDIT PANEL START
    // 
    static projectEditPanel = document.createElement("div");
    static {
        ProjectList.projectEditPanel.classList.add("edit-panel");
        ProjectList.projectEditPanel.innerHTML = editPanelTemplate;
    }

    static editProjectForm = ProjectList.projectEditPanel.querySelector(".edit-panel-actual");
    static editProjectFormTitle = ProjectList.editProjectForm.querySelector(".title");
    static editProjectFormHeader = ProjectList.editProjectForm.querySelector("h2");
    static editProjectFormDescription = ProjectList.editProjectForm.querySelector(".description");
    static editProjectFormPriority = ProjectList.editProjectForm.querySelector(".priority");
    static editProjectFormCancelButton = ProjectList.editProjectForm.querySelector(".cancel-button");
    static editProjectFormDate = ProjectList.editProjectForm.querySelector(".date");
    static {
        ProjectList.editProjectForm.addEventListener('submit', function(event) {
            event.preventDefault();
            ProjectList.editProject(ProjectList.projects[ProjectList.lastEditedProject], ProjectList.editProjectFormTitle.value, ProjectList.editProjectFormDescription.value, ProjectList.editProjectFormPriority.value, parseISO(ProjectList.editProjectFormDate.value));
            ProjectList.editProjectFormTitle.value = "";
            ProjectList.editProjectFormDescription.value = "";
            ProjectList.editProjectFormPriority.value = "";
            ProjectList.editProjectFormDate.value = "";
            ProjectList.closeProjectEditPanel();
        })

        ProjectList.editProjectFormCancelButton.addEventListener("click",() => ProjectList.closeProjectEditPanel())   
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
    static toDoDate = ProjectList.toDoForm.querySelector(".date");
    static toDoFormCancelButton = ProjectList.toDoForm.querySelector(".cancel-button");
    static {
        ProjectList.toDoForm.addEventListener('submit', function(event) {
            event.preventDefault();
            ProjectList.projects[ProjectList.lastActiveProject].addToDo(ProjectList.toDoFormTitle.value, ProjectList.toDoDescription.value, ProjectList.toDoPriority.value, ProjectList.toDoDate.value);
            ProjectList.toDoFormTitle.value = "";
            ProjectList.toDoDescription.value = "";
            ProjectList.toDoPriority.value = "";
            ProjectList.closeToDoAddPanel();
        })

        ProjectList.toDoFormCancelButton.addEventListener("click",() => ProjectList.closeToDoAddPanel())
        
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
    static toDoEditDate = ProjectList.toDoEditForm.querySelector(".date");
    static toDoEditFormCancelButton = ProjectList.toDoEditForm.querySelector(".cancel-button");
    static {
        ProjectList.toDoEditForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            ProjectList.projects[ProjectList.lastActiveProject].editToDo(
                ProjectList.projects[ProjectList.lastActiveProject].toDos[ProjectList.lastEditedToDo],
                ProjectList.toDoEditFormTitle.value,
                ProjectList.toDoEditDescription.value,
                ProjectList.toDoEditPriority.value,
                parseISO(ProjectList.toDoEditDate.value),
            )
            ProjectList.toDoEditFormTitle.value = "";
            ProjectList.toDoEditDescription.value = "";
            ProjectList.toDoEditPriority.value = "";
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
                let project = new Project(element.title, element.description, element.priority, element.toDos, index, element.completion, element.date);
                return project;
            })
        ProjectList.renderProjectList();
        
        
        }
        else {
            ProjectList.saveToLocalStorage();
            ProjectList.initializeProjectList();
        }
    }
    
    static addProject(title, description, priority, date) {
        const newProject = new Project(title, description, priority, [], ProjectList.projects.length, false, date);
        const newProjectIndex = this.projects.push(newProject) - 1;
        ProjectList.lastActiveProject = newProjectIndex;
        ProjectList.projects[newProjectIndex].renderToDoList();
        newProject.setArrayIndex(newProjectIndex);
        ProjectList.saveToLocalStorage();
        ProjectList.renderProjectList();
        ProjectList.chooseProjectIfNeeded();
        return newProject;
    }

    static removeProject(arrayIndex) {
        
        if (ProjectList.lastActiveProject == arrayIndex) {
            ProjectList.projects[arrayIndex].clearToDos();
            ProjectList.projects[arrayIndex].renderToDoList();
            toDosNode.innerHTML = "";
            const toDosHeader = document.createElement("h1");
            toDosHeader.textContent = "To-Dos";
            toDosNode.appendChild(toDosHeader);
        }

        ProjectList.projects = ProjectList.projects.filter((project) => ProjectList.projects[arrayIndex] != project);
        
        ProjectList.saveToLocalStorage();
        ProjectList.renderProjectList();
        ProjectList.chooseProjectIfNeeded();

        if (ProjectList.projects.length == 0) {
            toDosNode.innerHTML = "";
            const toDosHeader = document.createElement("h1");
            toDosHeader.textContent = "To-Dos";
            toDosNode.appendChild(toDosHeader);
        }
    }

    static chooseProjectIfNeeded() {
        console.log("lastActiveProject" + ProjectList.lastActiveProject);
        console.log("length " + ProjectList.projects.length);
        if(ProjectList.projects.length == 0) {
            ProjectList.lastActiveProject = null;
        } else if (ProjectList.lastActiveProject >= ProjectList.projects.length || !ProjectList.lastActiveProject) {
            ProjectList.lastActiveProject = 0;
            ProjectList.projects[0].renderToDoList();
        }
    }

    static editProject(projectToEdit, title, description, priority, date) {
        projectToEdit.updateDetails(title, description, priority, date);
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

    static showProjectEditPanel(index) {
        document.body.appendChild(ProjectList.projectEditPanel);
        ProjectList.lastEditedProject = index;

        let referenceProject = ProjectList.projects[index];
        ProjectList.projectEditPanel.querySelector("h1").textContent = "Edit Project: ";
        ProjectList.projectEditPanel.querySelector(".title").value = referenceProject.title;
        ProjectList.projectEditPanel.querySelector(".description").value = referenceProject.description;
        ProjectList.projectEditPanel.querySelector(".priority").value = Number(referenceProject.priority);
        if (isValid(referenceProject.date)) {
            ProjectList.projectEditPanel.querySelector(".date").value = format(referenceProject.date, "yyyy-MM-dd");
        }
        
    }

    static closeProjectAddPanel() {
        document.body.removeChild(ProjectList.projectAddPanel)
    }

    static closeProjectEditPanel() {
        document.body.removeChild(ProjectList.projectEditPanel)
    }

    static closeToDoAddPanel() {
        document.body.removeChild(ProjectList.toDoAddPanel)
    }

    static showToDoAddPanel() {
        document.body.appendChild(ProjectList.toDoAddPanel);
    }

    static showToDoEditPanel(indexOfToDo) {
        document.body.appendChild(ProjectList.toDoEditPanel);
        let referenceToDo = ProjectList.projects[this.lastActiveProject].toDos[indexOfToDo];
        ProjectList.toDoEditHeader.textContent = "Edit To-Do: ";
        ProjectList.toDoEditPanel.querySelector(".title").value = referenceToDo.title;
        ProjectList.toDoEditPanel.querySelector(".description").value = referenceToDo.description;
        if (isValid(referenceToDo.date)) {
            ProjectList.toDoEditPanel.querySelector(".date").value = format(referenceToDo.date, "yyyy-MM-dd");
        }
        ProjectList.toDoEditPanel.querySelector(".priority").value = Number(referenceToDo.priority);
        ProjectList.lastEditedToDo = indexOfToDo;
    }

    static closeToDoEditPanel() {
        document.body.removeChild(ProjectList.toDoEditPanel)
    }
}

class Project {
    constructor(title, description, priority, toDos = [], arrayIndex, completion, date) {
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.toDos = toDos;
        this.arrayIndex = arrayIndex;
        this.completion = completion;
        this.initializeToDoList();
        this.rootDomNode;
        this.date = date != null ? date : null;
    }

    setArrayIndex(value) {
        this.arrayIndex = value;
    }

    updateDetails(title, description, priority, date) {
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.date = date;
    }

    addToDo(title, description, priority, date) {
        console.log("addToDo arrayIndex = " + this.arrayIndex)
        let newToDo = new ToDo(title, description, priority, this.arrayIndex, false, this.toDos.length, date);
        this.toDos.push(newToDo);
        ProjectList.saveToLocalStorage();
        this.renderToDoList();
    }

    editToDo(toDoToEdit, title, description, priority, date) {
        console.log(toDoToEdit)
        toDoToEdit.updateDetails(title, description, priority, date);
        ProjectList.saveToLocalStorage();
        this.renderToDoList();
        // ProjectList.closeToDoEditPanel();
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
        this.toDos = this.toDos.map((element, index) => {
            // console.log(element.date)
            return new ToDo(element.title, element.description, element.priority, this.arrayIndex, element.completion, index, element.date);
        })
    }

    renderProject(index) {
        this.arrayIndex = index;
        const tempContainer = document.createElement("div");
        this.rootDomNode = tempContainer;
        tempContainer.innerHTML = projectTemplate;
        tempContainer.querySelector("h2").textContent = this.title;
        tempContainer.querySelector(".description").textContent = this.description;
        if (isValid(this.date)){
            tempContainer.querySelector(".date").textContent = "Due by: " + format(this.date, "M/d/yyyy");
        }
        tempContainer.querySelector(".priority").textContent = "Priority: " + this.priority;
        tempContainer.querySelector(".checkbox-gap").checked = this.completion;
        tempContainer.querySelector(".checkbox-gap").addEventListener("change", () => this.toggleCompletion());
        tempContainer.querySelector(".edit-button").addEventListener("click", () => {
            ProjectList.showProjectEditPanel(index);
        });
        
        tempContainer.querySelector(".view-button").addEventListener("click", () => this.renderToDoList())
        tempContainer.querySelector(".delete-button").addEventListener("click", () => ProjectList.removeProject(this.arrayIndex))

        this.renderProjectCompletion();

        projectsNode.appendChild(tempContainer);
    }

    renderToDoList() {
        ProjectList.lastActiveProject = this.arrayIndex;
        this.clearToDoRenders();
        this.toDos.forEach((element, index) => element.renderToDo(index))

        if (ProjectList.projects.length == 0)
            return;

        const addToDoButton = document.createElement("div");
        addToDoButton.classList.add("add-to-do-button");
        addToDoButton.addEventListener("click", () => ProjectList.showToDoAddPanel())
        addToDoButton.innerHTML = addToDoTemplate;
        toDosNode.appendChild(addToDoButton);
    }

    clearToDoRenders() {
        toDosNode.innerHTML = "";
        const toDosHeader = document.createElement("h1");
        toDosHeader.textContent = "To-Dos - " + ProjectList.projects[ProjectList.lastActiveProject].title;
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
    constructor(title, description, priority, projectIndex, completion, index, date) {
        this.title = title,
        this.description = description,
        this.priority = priority,
        this.projectIndex = projectIndex,
        this.completion = completion,
        this.rootDomNode,
        this.index = index,
        this.date = date
    }

    updateDetails(title, description, priority, date) {
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.date = date;
    }

    renderToDo(index) {
        const tempContainer = document.createElement("div");
        this.index = index;
        console.log(index);
        this.rootDomNode = tempContainer;
        tempContainer.innerHTML = toDoTemplate;
        tempContainer.querySelector("h2").textContent = this.title;
        tempContainer.querySelector(".description").textContent = this.description;
        if(isValid(this.date)) {
            tempContainer.querySelector(".date").textContent = "Due by: " + format(this.date, "M/d/yyyy");
        }
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