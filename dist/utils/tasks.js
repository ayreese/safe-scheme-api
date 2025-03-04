"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTasks = void 0;
const crypto_1 = __importDefault(require("crypto"));
const tasksList = [
    {
        name: 'Create Project',
        description: 'Create a project using the "create project" button in the projects panel',
    },
    {
        name: 'Create Task',
        description: 'Create a task using the "add task" button in the project header',
    },
    {
        name: 'Edit Task',
        description: 'Change this task name  "add task" button in the project header',
    },
];
const createTasks = () => {
    return tasksList.reduce((tasks, task) => {
        const taskId = crypto_1.default.randomUUID();
        tasks[taskId] = {
            TaskId: taskId,
            Task: task.name,
            Description: task.description,
            Status: 'todo',
            Subtasks: {},
            Attachments: [],
        };
        return tasks;
    }, {});
};
exports.createTasks = createTasks;
