"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.demoProjectsHandler = void 0;
const create_project_1 = require("./create-project");
const create_task_1 = require("./create-task");
const mockEvent_1 = require("../../utils/mockEvent");
const headers_1 = require("../../utils/headers");
const demoProjectsHandler = async (event) => {
    const tableName = process.env.PROJECTS_TABLE;
    const userId = event.request.userAttributes.userId;
    if (!tableName || !userId) {
        console.warn("Demo projects couldn't be created");
        throw new Error("Problem creating demo projects");
    }
    try {
        const projectMockEvent = (0, mockEvent_1.ProjectMockEvent)(mockEvent_1.learnSafeScheme, userId);
        const projectResponse = await (0, create_project_1.createProjectHandler)(projectMockEvent);
        const projectId = JSON.parse(projectResponse.body).ProjectId;
        for (const taskDescription of mockEvent_1.safeSchemeTasks) {
            const taskMockEvent = (0, mockEvent_1.TaskMockEvent)(taskDescription, userId, { ProjectId: projectId });
            await (0, create_task_1.createTaskHandler)(taskMockEvent);
        }
        return {
            statusCode: 201,
            body: projectResponse.body,
            headers: headers_1.responseHeaders
        };
    }
    catch (error) {
        console.error("Error in creating project for new user:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Failed to create project for new user",
                error: error.stack || error.message,
            }),
        };
    }
};
exports.demoProjectsHandler = demoProjectsHandler;
