import { APIGatewayProxyEvent, PostConfirmationTriggerEvent} from "aws-lambda";
import {createProjectHandler} from "./create-project";
import {createTaskHandler} from "./create-task";
import {ProjectMockEvent, TaskMockEvent, safeSchemeTasks, learnSafeScheme} from "../../utils/mockEvent";
import {LambdaResponse, responseHeaders} from "../../utils/headers";


export const demoProjectsHandler = async (event: PostConfirmationTriggerEvent) => {
    const tableName: string | undefined = process.env.PROJECTS_TABLE;
    const userId: string = event.request.userAttributes.userId;

    if (!tableName || !userId) {
        console.warn("Demo projects couldn't be created");
        throw new Error("Problem creating demo projects");
    }

    try {
        const projectMockEvent: APIGatewayProxyEvent = ProjectMockEvent(learnSafeScheme, userId);
        const projectResponse: LambdaResponse = await createProjectHandler(projectMockEvent);
        const projectId: string = JSON.parse(projectResponse.body).ProjectId;

        for (const taskDescription of safeSchemeTasks) {
            const taskMockEvent = TaskMockEvent(taskDescription, userId, {ProjectId: projectId});
            await createTaskHandler(taskMockEvent);
        }

        return {
            statusCode: 201,
            body: projectResponse.body,
            headers: responseHeaders
        };
    } catch (error: any) {
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
