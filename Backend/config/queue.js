const Queue = require("bull");
const cloudinary = require("./cloudinary");

const deleteQueue = new Queue("delete-image", {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
  },
});

// Worker — runs automatically when task is triggered
deleteQueue.process(async (job) => {
  const publicId = job.data.publicId;

  console.log("Deleting from Cloudinary:", publicId);

  await cloudinary.uploader.destroy(publicId);
});

module.exports = deleteQueue;