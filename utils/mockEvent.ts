import {ProjectBody, Tasks} from "./types";

export const learnSafeScheme: ProjectBody = {
    Project: "Learn Safe Scheme",
    Status: false,
};

export const safeSchemeTasks: string [] = [
     "Create a Project",
     "Create a task",
     "Create a Subtask",
     "Change the theme",
     "Change status",
     "Delete a task",
     "Delete a project",

]

export const createDemoTasks = (demoTasks: string[]) => {

    const tasks: Tasks  = {};
    for (let i = 0; i < safeSchemeTasks.length; i++) {
        const taskId = crypto.randomUUID();
        tasks[taskId] = {
            TaskId: taskId,
            TaskDescription:demoTasks[i],
            Status: "In Progress",
            Subtasks: {}
        };
    }

    return tasks;

}