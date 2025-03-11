export type ID = string

export interface Subtask {
    name: string;
    status: boolean;
}

export interface Subtasks {
    [key: string]: Subtask;

}

export interface Task {
    name: string;
    description: string;
    phase: string;
    subtasks: Record<ID, Subtask>
    attachments: [];
}

export interface Tasks {
    [key: string]: Task;
}

export interface Phases {
    [key: string]: Record<ID, Task>;
}