import { Task} from "./types";

export const tasksList: Task[] = [
    {
        name: 'Create Project',
        description: 'Create a project using the "create project" button in the projects panel',
        phase: "Todo",
        subtasks: {
            "3423452462": {name: 'Select template', status: false},
            "4505908141": {name: 'Fill in project details', status: false},
        },
        attachments: []
    },
    {
        name: 'Create Task',
        description: 'Create a task using the "add task" button in the project header',
        phase: "Todo",
        subtasks: {
            "039840397813": {name: 'Click "Add Task"', status: false},
            "039840397913": {name: 'Enter task description', status: false},
        },
        attachments: []
    },
    {
        name: 'Edit Task',
        description: 'Change this task name  "add task" button in the project header',
        phase: "Todo",
        subtasks: {
            "3095090834": {name: 'Change task name', status: false},
            "3095091834": {name: 'Save changes', status: false},
        },
        attachments: []
    },
];
