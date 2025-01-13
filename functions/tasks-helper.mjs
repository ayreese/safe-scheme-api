// Function to create id's or return empty array
import crypto from 'crypto';

// Function to get user from table
export const tasksHelper = (tasks) => {
    if (tasks.length === 0) {
        return tasks

    } else {
        return tasks.map(task => ({
            TaskId: crypto.randomUUID(),
            Task: task.Task,
            Status: task.Status,
            SubTasks: task.Subtasks.map(subtask => ({
                SubtaskId: crypto.randomUUID(),
                ...subtask,
            }))
        }));
    }

};
