"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.facilitatorHandler = void 0;
const headers_1 = require("../../utils/headers");
const get_projects_1 = require("./get-projects");
const create_project_1 = require("./create-project");
const create_task_1 = require("./create-task");
const create_subtask_1 = require("./create-subtask");
const edit_project_1 = require("./edit-project");
const edit_task_1 = require("./edit-task");
const edit_subtask_1 = require("./edit-subtask");
const delete_project_1 = require("./delete-project");
const delete_task_1 = require("./delete-task");
const delete_subtask_1 = require("./delete-subtask");
const facilitatorHandler = async (event) => {
    if (!event.requestContext.authorizer) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Unauthorized request" }),
            headers: headers_1.responseHeaders
        };
    }
    if (!event.pathParameters) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Request type required" }),
            headers: headers_1.responseHeaders
        };
    }
    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Request body required" }),
            headers: headers_1.responseHeaders
        };
    }
    const defaultRequest = {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid request" }),
        headers: headers_1.responseHeaders,
    };
    // const request = JSON.parse(event.body);
    const requestType = event.pathParameters.requestType;
    switch (event.httpMethod) {
        case "GET":
            switch (requestType) {
                case "userProjects":
                    return await (0, get_projects_1.getProjectsHandler)(event);
                default:
                    return defaultRequest;
            }
        case "POST":
            switch (requestType) {
                case "project":
                    return await (0, create_project_1.createProjectHandler)(event);
                case "task":
                    return await (0, create_task_1.createTaskHandler)(event);
                case "subtask":
                    return await (0, create_subtask_1.createSubtaskHandler)(event);
                default:
                    return defaultRequest;
            }
        case "PUT":
            switch (requestType) {
                case "project":
                    return await (0, edit_project_1.editProjectHandler)(event);
                case "task":
                    return await (0, edit_task_1.editTaskHandler)(event);
                case "subtask":
                    return await (0, edit_subtask_1.editSubtaskHandler)(event);
                default:
                    return defaultRequest;
            }
        case "DELETE":
            switch (requestType) {
                case "project":
                    await (0, delete_project_1.deleteProjectHandler)(event);
                    break;
                case "task":
                    await (0, delete_task_1.deleteTaskHandler)(event);
                    break;
                case "subtask":
                    await (0, delete_subtask_1.deleteSubtaskHandler)(event);
                    break;
                default:
                    return defaultRequest;
            }
            break;
        default:
            return defaultRequest;
    }
    return defaultRequest;
};
exports.facilitatorHandler = facilitatorHandler;
