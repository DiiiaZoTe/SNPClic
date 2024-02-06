export const logError = async (params: { location: string, request: any, error: any, }) => {
  // anything that needs to be logged on digested by log service
  console.log({
    location: params.location,
    error: params.error,
    requestBody: params.request,
  });
}