"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeSchemeTasks = exports.learnSafeScheme = exports.TaskMockEvent = exports.ProjectMockEvent = void 0;
const createMockEvent = (body, userId, params) => {
    return {
        body: JSON.stringify(body),
        requestContext: {
            accountId: "",
            requestId: "",
            httpMethod: "POST",
            authorizer: { claims: { sub: userId } },
            apiId: "",
            protocol: "",
            identity: {
                accessKey: null,
                accountId: null,
                apiKey: null,
                apiKeyId: null,
                caller: null,
                clientCert: null,
                cognitoAuthenticationProvider: null,
                cognitoAuthenticationType: null,
                cognitoIdentityId: null,
                cognitoIdentityPoolId: null,
                principalOrgId: null,
                sourceIp: "",
                user: null,
                userAgent: null,
                userArn: null
            },
            path: "",
            stage: "",
            requestTimeEpoch: 0,
            resourceId: "",
            resourcePath: ""
        },
        headers: {},
        multiValueHeaders: {},
        httpMethod: "POST",
        isBase64Encoded: false,
        path: "/",
        pathParameters: params,
        queryStringParameters: null,
        multiValueQueryStringParameters: null,
        stageVariables: null,
        resource: "/{proxy+}",
    };
};
const ProjectMockEvent = (project, userId) => createMockEvent(project, userId, null);
exports.ProjectMockEvent = ProjectMockEvent;
const TaskMockEvent = (task, userId, params) => createMockEvent(task, userId, params);
exports.TaskMockEvent = TaskMockEvent;
exports.learnSafeScheme = {
    Project: "Learn Safe Scheme",
    Status: false,
};
exports.safeSchemeTasks = [
    { TaskDescription: "Create a Project" },
    { TaskDescription: "Create a task" },
    { TaskDescription: "Create a Subtask" },
    { TaskDescription: "Change the theme" },
    { TaskDescription: "Change status" },
    { TaskDescription: "Delete a task" },
    { TaskDescription: "Delete a project" },
];
