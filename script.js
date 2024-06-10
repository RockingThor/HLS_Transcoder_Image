const axios = require("axios");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const path = require("path");
const fs = require("fs");
const mime = require("mime-types");

//https://tweet-video-mine.s3.amazonaws.com/data/2/file_example_MP4_1920_18MG.mp4

const s3Client = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_R,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_R,
  },
});

const USER_ID = process.env.USER_ID;
const TWEET_ID = process.env.TWEET_ID;

async function main() {
  console.log("Starting uploading transcoded file to S3");

  const folderPath = path.join(__dirname, "output");
  const FolderContents = fs.readdirSync(folderPath, {
    recursive: true,
  });

  console.log("Starting to upload");

  for (const file of FolderContents) {
    const filePath = path.join(folderPath, file);
    if (fs.lstatSync(filePath).isDirectory()) continue;

    console.log("uploading", filePath);

    const command = new PutObjectCommand({
      Bucket: "thumbnail-rohit",
      Key: `twitter/${USER_ID}/${TWEET_ID}/${file}`,
      Body: fs.createReadStream(filePath),
      ContentType: mime.lookup(filePath),
    });

    await s3Client.send(command);
    console.log("uploaded", filePath);
  }
  console.log("Upload done");
}

main();
