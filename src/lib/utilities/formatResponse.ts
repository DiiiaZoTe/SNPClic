import { NextRequest, NextResponse } from "next/server";

/**
 * @example 
 * export const GET = withErrorHandler(async (request) => {
 *   // do something
 * });
 */
export const withErrorHandler = (fn: any) => {
  return async function (request: NextRequest, ...args: any) {
    try {
      return await fn(request, ...args);
    } catch (error) {

      // Log the error to a logging system
      console.log({ error, requestBody: request, location: fn.name });
      // Respond with a generic 500 Internal Server Error
      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }
  };
}