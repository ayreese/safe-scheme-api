// Validate the body of Lambda events
export const validateBody = (body) => {
    if (!body) {
        console.error("Invalid input data");
        throw new Error("Body is missing or invalid");
    }
    // Log the received event
    console.info('Received event:', body);
    return body;
};

