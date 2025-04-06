import {APIGatewayEvent} from "aws-lambda";
import {responseHeaders} from "../../utils/headers";
import {getProjectsHandler} from "./get-projects";
import {createProjectHandler} from "./create-project";
import {createTaskHandler} from "./create-task";
import {createSubtaskHandler} from "./create-subtask";
import {editProjectHandler} from "./edit-project";
import {editTaskHandler} from "./edit-task";
import {editSubtaskHandler} from "./edit-subtask";
import {deleteProjectHandler} from "./delete-project";
import {deleteTaskHandler} from "./delete-task";
import {deleteSubtaskHandler} from "./delete-subtask";
import {updateTaskHandler} from "./update-task";


export const facilitatorHandler = async (event: APIGatewayEvent) => {
    if (!event.requestContext.authorizer) {
        return {
            statusCode: 400,
            body: JSON.stringify({message: "Unauthorized request"}),
            headers: responseHeaders
        };
    }

    if (!event.pathParameters) {
        return {
            statusCode: 400,
            body: JSON.stringify({message: "Request type required"}),
            headers: responseHeaders
        };
    }


    const defaultRequest = {
        statusCode: 400,
        body: JSON.stringify({message: "Invalid request"}),
        headers: responseHeaders,
    };

    // const request = JSON.parse(event.body);

    const requestType = event.pathParameters.requestType;

    switch (event.httpMethod) {
        case "GET":
            switch (requestType) {
                case "userProjects":
                    return await getProjectsHandler(event)
                default:
                    return defaultRequest

            }
        case "POST":
            switch (requestType) {
                case "project":
                    return await createProjectHandler(event);
                case "task":
                    return await createTaskHandler(event);
                case "subtask":
                    return await createSubtaskHandler(event);
                default:
                    return defaultRequest
            }
        case "PUT":
            switch (requestType) {
                case "project":
                    return await editProjectHandler(event);
                case "task":
                    return await editTaskHandler(event);
                case "subtask":
                    return await editSubtaskHandler(event);
                case "updateTask":
                    return await updateTaskHandler(event);
                default:
                    return defaultRequest
            }
        case "DELETE":
            switch (requestType) {
                case "project":
                    return await deleteProjectHandler(event);
                case "task":
                    return await deleteTaskHandler(event);
                case "subtask":
                    return await deleteSubtaskHandler(event);
                default:
                    return defaultRequest
            }
        default:
            return defaultRequest
    }
};
