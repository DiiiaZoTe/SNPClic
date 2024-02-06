import chromium from 'chrome-aws-lambda'
import { logError } from './logger'
import * as puppeteer from 'puppeteer'

export async function getBrowserInstance() {
  const executablePath = await chromium.executablePath

  if (!executablePath) {
    // running locally
    const puppeteer = require('puppeteer')
    return puppeteer.launch({
      args: chromium.args,
      headless: true,
      defaultViewport: {
        width: 1280,
        height: 720
      },
      ignoreHTTPSErrors: true
    })
  }

  return chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: {
      width: 1280,
      height: 720
    },
    executablePath,
    headless: chromium.headless,
    ignoreHTTPSErrors: true
  })
}

export async function getPDFBuffer(html: string) {
  let browser = undefined;
  let pdf = undefined;
  try {
    browser = await getBrowserInstance()
    const page = await browser.newPage()
    await page.setContent(html)
    pdf = await page.pdf({ 
      // path: `test-${performance.now()}.pdf`, 
      format: 'A4'
    })

  } catch (error) {
    logError({ location: 'getPDFBuffer', error, request: { html } })
  }
  finally {
    if (browser) await browser.close()
    return pdf;
  }
}