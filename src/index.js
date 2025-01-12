class ProjectList {
    constructor() {
        this.projects = [];
    }
    
    addProject(title, description, priority) {
        const newProject = new Project(title, description, priority);
        this.projects.push(newProject);
    }

    removeProject(projectToRemove) {
        this.projects = this.projects.filter((project) => project != projectToRemove)
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