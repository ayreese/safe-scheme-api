import crypto from 'crypto';

interface TaskList {
    name: string;
    description: string;
}

interface Task {
    TaskId: string;
    Task: string;
    Description: string;
    Status: string;
    Subtasks: Record<string, unknown>;
    Attachments: string[];
}

interface Tasks {
    [key: string]: Task;
}

const tasksList: TaskList[] = [
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

export const createTasks = (): Tasks => {
    return tasksList.reduce((tasks, task) => {
        const taskId = crypto.randomUUID();
        tasks[taskId] = {
            TaskId: taskId,
            Task: task.name,
            Description: task.description,
            Status: 'todo',
            Subtasks: {},
            Attachments: [],
        };
        return tasks;
    }, {} as Tasks);
};
