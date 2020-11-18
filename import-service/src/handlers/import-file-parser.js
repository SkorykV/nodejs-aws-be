import { parseService } from '../services/parse-service';

export async function importFileParser(event) {
  console.log('importFileParser was invoked', event);
  //event.Records always contain only one record for s3, so we could process only event.Records[0]
  //I just left this approach for fun
  const promises = event.Records.map((record) =>
    (async () => {
      const bucket = record.s3.bucket.name;
      const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));
      const parsedFilesFolder = 'parsed';

      await parseService.process(bucket, key, parsedFilesFolder);
    })(),
  );

  await Promise.all(promises);
  console.log('importFileParser finished');
}
