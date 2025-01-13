class ProjectList {
        static projects = [];
        static localProjectList;
        // static {
        //     ProjectList.initializeProjectList();
        // }

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
            this.projects = this.projects.map((element) => {
                console.log(element);
                let project = new Project(element.title, element.description, element.priority, element.toDos);
                return project;
            })
        }
        else {
            ProjectList.saveToLocalStorage();
        }
    }
    
    static addProject(title, description, priority) {
        const newProject = new Project(title, description, priority);
        this.projects.push(newProject);
        ProjectList.saveToLocalStorage();
        return newProject;
    }

    static removeProject(projectToRemove) {
        this.projects = this.projects.filter((project) => project != projectToRemove);
        ProjectList.saveToLocalStorage();
    }

    static editProject(projectToEdit, title, description, priority) {
        projectToEdit.updateDetails(title, description, priority);
        ProjectList.saveToLocalStorage();
    }

    static clearProjects() {
        if (localStorage)
        localStorage.removeItem("projects");
        this.localProjectList = [];
        this.projects = [];
    }

    static renderProjectList() {
        console.log("Removing projects from list parent (not implemented yet)")
        this.projects.forEach((project) => {project.render()})
    }
}

class Project {
    constructor(title, description, priority, toDos = []) {
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.toDos = toDos;
        this.initializeToDoList();
    }

    updateDetails(title, description, priority) {
        this.title = title;
        this.description = description;
        this.priority = priority;
    }

    render() {
        console.log("Render " + this.title + " (not implemented yet)");
    }

    addToDo(title, description, priority) {
        let newToDo = new ToDo(title, description, priority);
        this.toDos.push(newToDo);
        ProjectList.saveToLocalStorage();
    }

    editToDo(toDoToEdit, title, description, priority) {
        toDoToEdit.updateDetails(title, description, priority);
        ProjectList.saveToLocalStorage();
    }

    removeToDo(toDoToRemove) {
        this.toDos = this.toDos.filter((element) => element != toDoToRemove);
        ProjectList.saveToLocalStorage();
    }

    clearToDos() {
        this.toDos = [];
        ProjectList.saveToLocalStorage();
    }

    initializeToDoList() {
        this.toDos = this.toDos.map((element) => {
            return new ToDo(element.title, element.description, element.priority);
        })
    }
}

class ToDo {
    constructor(title, description, priority) {
        this.title = title,
        this.description = description,
        this.priority = priority
    }

    updateDetails(title, description, priority) {
        this.title = title;
        this.description = description;
        this.priority = priority;
    }
}

window.ProjectList = ProjectList;

ProjectList.initializeProjectList();

// ProjectList.clearProjects();
// ProjectList.addProject("myFavoriteProject","It's my first",10);
// let newProj = ProjectList.addProject("myFavoriteProject","It's my first",10);
// // console.log(projectList.projects);

// newProj.createToDo("newToDo", "My very first ToDO!", 15)
console.log(ProjectList.projects)