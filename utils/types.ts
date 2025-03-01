export interface ProjectBody  {
    Project: string
    Status: boolean
}

export interface TaskBody {
    TaskId: string;
    TaskDescription: string;
    Status: string;
    Subtasks: Record<string, any>;
}

export interface Tasks {
    [key: string]: TaskBody;
}

