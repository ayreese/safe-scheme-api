"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.phaseTask = exports.createTasks = void 0;
exports.createPhases = createPhases;
const crypto_1 = __importDefault(require("crypto"));
// Function to create the phases object from an array of phase names
function createPhases(phasesArray) {
    const phases = {};
    phasesArray.forEach((p) => {
        phases[p] = {};
    });
    phases.default = {};
    return phases;
}
// Create tasks and subtask for demo project
const createTasks = (list) => {
    return list.reduce((items, item) => {
        const id = crypto_1.default.randomUUID();
        items[id] = {
            ...item,
        };
        return items;
    }, {});
};
exports.createTasks = createTasks;
const phaseTask = (phases, task) => {
    for (const [key, value] of Object.entries(phases)) {
        task.forEach((task) => {
            if (task.phase === key) {
                const id = crypto_1.default.randomUUID();
                phases[key] = {
                    ...value, [id]: task,
                };
            }
        });
    }
    return phases;
};
exports.phaseTask = phaseTask;
