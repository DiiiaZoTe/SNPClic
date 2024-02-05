import { NextRequest } from "next/server";

export const logError = async (params: { location: string, request: NextRequest, error: any, }) => {
  // anything that needs to be logged on digested by log service
  console.log({
    location: params.location,
    error: params.error,
    requestBody: params.request,
  });
}