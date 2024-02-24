import { GetObjectCommand } from '@aws-sdk/client-s3'

import { r2 } from '@/server/storage/r2'
import { NextRequest } from 'next/server';
import { logError } from '@/lib/utilities/logger';

export async function POST(
  request: NextRequest,
  { params: { filename } }: { params: { filename: string } }
) {
  if (!filename) return new Response("File name is required.", { status: 400 });

  try {
    const pdf = await r2.send(
      new GetObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: `${filename}.pdf`,
      })
    );

    if (!pdf) {
      throw new Error('File could not be found.');
    }

    return new Response(pdf.Body?.transformToWebStream(), {
      headers: {
        'Content-Type': 'application/pdf',
      },
    });
  } catch (err: any) {
    logError({ request, error: err.message || err, location: `/api/download/${filename}` });
    return new Response("File could not be downloaded.", { status: 500 });
  }
}