require('dotenv').config({ path: './config.env' });

const express = require('express');
const cors = require('cors');
const dbo = require('./Data/conn');
const PORT = process.env.PORT || 54321;
const app = express();

app.use(cors());
app.use(express.json());

// Register 'controller routes'
app.use(require('./routes/recipe'));
app.use(require('./routes/ingredient'));

// perform a database connection when the server starts
dbo.connectToServer(function (err) {
  if (err) {
    console.log(`There was an error connecting to MongoDB. The application has been terminated:\n${err}`);
    process.exit();
  }

  // start the Express server
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
});