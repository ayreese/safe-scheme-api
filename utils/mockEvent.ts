import {APIGatewayEvent, APIGatewayProxyEventPathParameters} from "aws-lambda";

interface ProjectBody  {
    Project: string
    Status: boolean
}

interface TaskBody  {
    TaskDescription: string
}

const createMockEvent = (body: ProjectBody | TaskBody, userId: string, params: APIGatewayProxyEventPathParameters | null): APIGatewayEvent => {
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

export const ProjectMockEvent = (project: ProjectBody, userId: string): APIGatewayEvent => createMockEvent(project, userId, null);
export const TaskMockEvent = (task: TaskBody, userId: string, params: APIGatewayProxyEventPathParameters): APIGatewayEvent => createMockEvent(task, userId, params);


export const learnSafeScheme: ProjectBody = {
    Project: "Learn Safe Scheme",
    Status: false,
};

export const safeSchemeTasks: { TaskDescription: string }[] = [
    {TaskDescription: "Create a Project"},
    {TaskDescription: "Create a task"},
    {TaskDescription: "Create a Subtask"},
    {TaskDescription: "Change the theme"},
    {TaskDescription: "Change status"},
    {TaskDescription: "Delete a task"},
    {TaskDescription: "Delete a project"},

]

