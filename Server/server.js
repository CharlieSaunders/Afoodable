const express = require('express');
const cors = require('cors');
const dbo = require('./Data/conn');
const PORT = 9998;

const app = express();

app.use(cors());
app.use(express.json());


app.use(require('./Routes/recipeTags'));
app.use(require('./Routes/recipe'));
app.use(require('./Routes/ingredient'));
app.use(require('./Routes/email'))

dbo.connectToServer(function (err) {
  console.log("Connecting...");
  if (err) {
    console.log(`There was an error connecting to MongoDB. The application has been terminated:\n${err}`);
    process.exit();
  }

  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
});