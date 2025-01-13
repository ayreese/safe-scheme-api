// // Function to create id's or return empty array
// import crypto, {randomUUID} from 'crypto';
//
// // Function to get user from table
// export const tasksHelper = (tasks) => {
//     if (tasks.length === 0) {
//         return tasks
//
//     } else {
//         return tasks.forEach(task => {
//             const taskId = crypto.randomUUID();
//             const struct = {
//                 [taskId]: {
//                     Description: task.description,
//                     Status: false,
//                     Subtasks: {}
//                 },
//
//             }
//             task.subtasks.forEach((subtask) => {
//                 const subtaskId = crypto.randomUUID();
//                 struct[taskId].Subtasks[subtaskId] = {
//                     [subtaskId]: {
//                         Description: task.description,
//                         Status: false,
//                         Subtasks: {}
//                     },
//
//                 };
//             })
//             return struct;
//         });
//         // return tasks.map(task => ({
//         //     TaskId: crypto.randomUUID(),
//         //     Task: task.Task,
//         //     Status: task.Status,
//         //     SubTasks: task.Subtasks.map(subtask => ({
//         //         SubtaskId: crypto.randomUUID(),
//         //         ...subtask,
//         //     }))
//         // }));
//     }
//
// };
