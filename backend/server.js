const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log(`Unhandled Exception! 💥 Shutting down...
    Time: ${new Date()}`);
  console.log(err);
  process.exit(1);
});

// TODO: Reminders for contracts
// TODO: check reminders permissions on cronJobs and remove it from controllers
// TODO: enhance all dates (maybe use moment.js or date-fns or dayjs or luxon)

dotenv.config();
const app = require("./app");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log(`DB connect successfully. Time: ${new Date()}`));

const port = process.env.PORT || 3001;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}. Time: ${new Date()}`);
});

process.on("unhandledRejection", (err) => {
  console.log(`Unhandled Rejection! 💥 Shutting down...
    Time: ${new Date()}`);
  // console.log(err.name, err.message);
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
