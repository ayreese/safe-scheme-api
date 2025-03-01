"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDemoTasks = exports.safeSchemeTasks = exports.learnSafeScheme = void 0;
exports.learnSafeScheme = {
    Project: "Learn Safe Scheme",
    Status: false,
};
exports.safeSchemeTasks = [
    "Create a Project",
    "Create a task",
    "Create a Subtask",
    "Change the theme",
    "Change status",
    "Delete a task",
    "Delete a project",
];
const createDemoTasks = (demoTasks) => {
    const tasks = {};
    for (let i = 0; i < exports.safeSchemeTasks.length; i++) {
        const taskId = crypto.randomUUID();
        tasks[taskId] = {
            TaskId: taskId,
            TaskDescription: demoTasks[i],
            Status: "In Progress",
            Subtasks: {}
        };
    }
    return tasks;
};
exports.createDemoTasks = createDemoTasks;
