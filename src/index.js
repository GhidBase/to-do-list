class ProjectList {
    constructor() {
        this.projects = [];
        this.localProjectList;
    }

    getLocalStorage() {
        this.localProjectList = localStorage.getItem("projects");
        return this.localProjectList;
    }

    saveToLocalStorage() {
        console.log("saving to local storage");
        localStorage.setItem("projects", JSON.stringify(this.projects))
    }

    initializeProjectList() {
        console.log("\ninitializing project list object")
        if (this.getLocalStorage()) {
            this.projects = JSON.parse(this.localProjectList);
        }
        else {
            this.saveToLocalStorage();
        }
    }
    
    addProject(title, description, priority) {
        const newProject = new Project(title, description, priority);
        this.projects.push(newProject);
        this.saveToLocalStorage();
        return newProject;
    }

    removeProject(projectToRemove) {
        this.projects = this.projects.filter((project) => project != projectToRemove);
        this.saveToLocalStorage();
    }

    clearProjects() {
        if (localStorage)
        localStorage.removeItem("projects");
        this.localProjectList = [];
        this.projects = [];
    }

}

class Project {
    constructor(title, description, priority) {
        this.title = title,
        this.description = description,
        this.priority = priority
    }
}

class ToDo {
    constructor(title, description, priority) {
        this.title = title,
        this.description = description,
        this.priority = priority
    }
}


const projectList = new ProjectList;
projectList.initializeProjectList();
// let refProj = projectList.addProject("doodoo project", "doodoo", 12)
console.log(projectList.projects);
// // projectList.removeProject(refProj);
// projectList.clearProjects();
// console.log(projectList.projects);
