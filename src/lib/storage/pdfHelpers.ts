// import chromium from 'chrome-aws-lambda'
import chromium from "@sparticuz/chromium";
import { logError } from '../utilities/logger';

export const pdfGetHtmlString = async (element: JSX.Element) => {
  const { renderToStaticMarkup: jsxToHtmlString } = await import("react-dom/server");
  const pdfHtml = jsxToHtmlString(element);
  return pdfHtml;
};

export async function getBrowserInstance() {
  const puppeteer = require('puppeteer');
  return puppeteer.launch({
    args: chromium.args,
    headless: true,
    defaultViewport: {
      width: 1920,
      height: 1080
    },
    ignoreHTTPSErrors: true
  })
}

async function getPDFBuffer(html: string) {
  let browser = undefined;
  let pdf: Buffer | undefined = undefined;
  try {
    browser = await getBrowserInstance()
    const page = await browser.newPage()
    await page.setContent(html);
    pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true
    })

  } catch (error) {
    logError({ location: 'getPDFBuffer', error })
  }
  finally {
    if (browser) await browser.close()
    return pdf;
  }
}

export async function generatePDF(element: JSX.Element) {
  const pdfHtml = await pdfGetHtmlString(element);
  if (!pdfHtml) return undefined;
  const pdf = await getPDFBuffer(pdfHtml);
  if (!pdf) return undefined;
  return pdf;
}