import { BaseError } from '../models/base-error';
import { uploadService } from '../services/upload-service';
import { corsHeaders } from '../helpers/cors-headers';

export async function importProductsFile(event) {
  try {
    const fileName =
      event.queryStringParameters && event.queryStringParameters.name;

    if (!fileName) {
      throw new BaseError(400, 'name should be provided in query parameters');
    }

    const bucket = process.env.BUCKET;
    const key = `uploaded/${decodeURIComponent(fileName.replace(/\+/g, ' '))}`;
    const contentType = 'text/csv';

    const signedUrl = await uploadService.getSignedUrl(
      bucket,
      key,
      contentType,
    );

    return {
      statusCode: 200,
      headers: { ...corsHeaders },
      body: JSON.stringify(signedUrl, null, 2),
    };
  } catch (e) {
    if (e instanceof BaseError) {
      return {
        statusCode: e.code,
        headers: { ...corsHeaders },
        body: JSON.stringify({ error: e.message }),
      };
    } else {
      return {
        statusCode: 500,
        headers: { ...corsHeaders },
        body: JSON.stringify({ error: e.message }),
      };
    }
  }
}
