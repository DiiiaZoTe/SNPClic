import { logError } from '../utilities/logger'
import { env } from '@/env';

import { PDFGeneratorClient } from "diiiazote-pdf-generator-client";

const pdfGeneratorClient = new PDFGeneratorClient({
  apiKey: env.PDF_API_KEY,
  apiBaseUrl: env.PDF_API_URL,
});

export const pdfGetHtmlString = async (element: JSX.Element) => {
  const { renderToStaticMarkup: jsxToHtmlString } = await import("react-dom/server");
  const pdfHtml = jsxToHtmlString(element);
  return pdfHtml;
};

export async function generatePDF(element: JSX.Element) {
  const pdfHtml = await pdfGetHtmlString(element);
  if (!pdfHtml) return undefined;
  const { data, error } = await pdfGeneratorClient.generate(pdfHtml);
  if (error)
    logError({ location: 'generatePDF', error })
  return data;
}