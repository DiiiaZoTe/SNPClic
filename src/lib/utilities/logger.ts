export const logError = async (params: { location?: string, request?: any, error?: any, otherData?: any }) => {
  // anything that needs to be logged on digested by log service
  console.error({
    location: params.location,
    error: params.error,
    requestBody: params.request,
    otherData: params.otherData,
  });
}