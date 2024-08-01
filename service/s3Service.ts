import { S3 } from "aws-sdk";
import { randomUUID } from "crypto";

export const uploadToS3 = async (file:any) => {
  const s3 = new S3();
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `booksImg/${randomUUID()}-${file.originalname}`,
    Body: file.buffer,
  };
  //@ts-ignore
  return await s3.upload(params).promise();
};
