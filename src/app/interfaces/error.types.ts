


export interface TErrorSources {
    path : string;
    message : string;
}

export interface TGenericErrorResponse{
    statusCode : string | number;
    message : string;
    errorSources ?: TErrorSources[] ;
}