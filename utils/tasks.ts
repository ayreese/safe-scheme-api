import crypto from 'crypto';

interface TaskList {
    name: string;
    description: string;
    attachments: string[];
}

interface Task {
    TaskId: string;
    Task: string;
    Description: string;
    Status: string;
    Subtasks: [key: string] | NonNullable<unknown>;
    Attachments: string[];
}

interface Tasks {
    [key: string]: Task;
}

const tasksList: TaskList[] = [
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
    {
        name: 'Edit Task',
        description: 'Change this task name  "add task" button in the project header',
        attachments: [],
    },
];

export const createTasks = () => {
    const tasks: Tasks = {};
    tasksList.forEach((task) => {
        const taskId = crypto.randomUUID();
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
