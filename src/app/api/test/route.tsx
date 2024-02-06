import { logError } from "@/lib/logger";
import { NextRequest } from "next/server";
import { r2 } from "@/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getPDFBuffer } from "@/lib/pdfHelpers";

export async function POST(request: NextRequest) {
  try {
    //* if we just want to generate the pdf assuming that data is already in database:
    // 1. get results from database
    // 2. generate html
    // 3. generate pdf
    // 4. upload to R2

    //* if we want to generate as we save the data to the database
    // 1. get the form data from the request
    // 2. in parallel, save the form data to the database and generate the pdf
    // 3. if the database save is successful, upload the pdf to R2
    // 4. return success message to the client

    // const time1 = performance.now();

    //* render the component to html string
    // const { renderToString: jsxToHtmlString } = await import(
    //   "react-dom/server"
    // );
    // const pdfHtml = jsxToHtmlString(<MyComponent />);

    //* generate pdf like this
    // const pdf = await getPDFBuffer(pdfHtml);

    //* upload to R2 like this
    // const uploadedPDF = await r2.send(new PutObjectCommand({
    //   Bucket: process.env.R2_BUCKET_NAME,
    //   Key: `${"form_response_id"}.pdf`,
    //   Body: pdf,
    //   ContentType: 'application/pdf'
    // }));

    // const time2 = performance.now();
    // console.log(`Time to render: ${time2 - time1}ms`);

    return new Response("Success", { status: 200 });
  } catch (err: any) {
    logError({ request, error: err.message || err, location: `/api/test` });
    return new Response("Error", { status: 500 });
  }
}

// const MyComponent = () => {
//   return (
//     <div>
//       <h1>Hello, PDF!</h1>
//     </div>
//   );
// };
