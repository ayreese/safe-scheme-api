
export interface LambdaResponse {
    statusCode: number | undefined;
    body: string;
    headers: {
        "Content-Type": string;
        "Access-Control-Allow-Origin": string;
        "Access-Control-Allow-Headers": string;
    };
}

export const responseHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, Accept",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE"
};