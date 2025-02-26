"use strict";
// Validate the body of Lambda events
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = void 0;
const validateBody = (event) => {
    if (!event) {
        console.error("Invalid input data");
        throw new Error("Body is missing or invalid");
    }
    // Log the received event
    console.info('Received event:', event);
    return event;
};
exports.validateBody = validateBody;
