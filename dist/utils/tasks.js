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
        attachments: [],
    },
    {
        name: 'Create Task',
        description: 'Create a task using the "add task" button in the project header',
        attachments: [],
    },
];
const createTasks = () => {
    const tasks = {};
    tasksList.forEach((task) => {
        const taskId = crypto_1.default.randomUUID();
        tasks[taskId] = {
            TaskId: taskId,
            Task: task.name,
            Description: task.description,
            Status: 'todo',
            Subtasks: {},
            Attachments: [],
        };
    });
    console.log(tasks);
    return tasks;
};
exports.createTasks = createTasks;
