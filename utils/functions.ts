import {Phases, Subtask, Subtasks, Task, Tasks} from "./types";
import crypto from "crypto";

// Function to create the phases object from an array of phase names
export function createPhases(phasesArray: string[]): Phases {
    const phases: Phases = {};

    phasesArray.forEach((p: string) => {
        phases[p] = {};
    });

    phases.default = {};

    return phases;
}

// Create tasks and subtask for demo project
export const createTasks = (list: Task[] | Subtask[]): Tasks | Subtasks => {
    return list.reduce((items: Tasks | Subtasks, item: Task | Subtask) => {
        const id: string = crypto.randomUUID();
        items[id] = {
            ...item,
        };
        return items;
    }, {} as Tasks | Subtasks);
};


export const phaseTask = (phases: Phases, task: Task[]) => {

    for (const [key, value] of Object.entries(phases)) {
        task.forEach((task: Task) => {
            if (task.phase === key) {
                const id = crypto.randomUUID();
                phases[key] = {
                    ...value, [id]: task,
                }
            }
        })
    }
    return phases;
}