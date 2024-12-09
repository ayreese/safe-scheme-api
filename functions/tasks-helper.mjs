// Function to create id's or return empty array
import crypto from 'crypto';

// Function to get user from table
export const tasksHelper = (tasks) => {
    if (tasks.length === 0) {
        return tasks

    } else {
        const taskID = crypto.randomBytes(8).toString('hex');
        return tasks.map(task => ({
            id: taskID,  // Add or override the 'id' property
            ...task      // Spread the properties of the existing task
        }));
    }

};
