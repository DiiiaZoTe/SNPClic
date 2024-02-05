import { GetObjectCommand } from '@aws-sdk/client-s3'

import { r2 } from '@/lib/r2'
import { NextRequest } from 'next/server';
import { logError } from '@/lib/logger';

export async function GET(
  request: NextRequest,
  { params: { filename } }: { params: { filename: string } }
) {
  if (!filename) return new Response("File name is required.", { status: 400 });

  try {
    console.log(`Retrieving ${filename} from R2!`);

    const pdf = await r2.send(
      new GetObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        // Key: `${filename}.pdf`,
        Key: `${filename}.png`,
      })
    );

    if (!pdf) {
      throw new Error('File could not be found.');
    }

    return new Response(pdf.Body?.transformToWebStream(), {
      headers: {
        // 'Content-Type': 'application/pdf',
        'Content-Type': 'image/png',
      },
    });
  } catch (err: any) {
    logError({request, error: err.message || err, location: `/api/download/${filename}`});
    return new Response("File could not be downloaded.", { status: 500 });
  }
}