// Validate the body of Lambda events
export const validateBody = (event) => {
    if (!event) {
        console.error("Invalid input data");
        throw new Error("Body is missing or invalid");
    }
    // Log the received event
    console.info('Received event:', event);
    return event;
};

