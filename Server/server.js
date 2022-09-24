require('dotenv').config({ path: './config.env' });

const express = require('express');
const cors = require('cors');
const dbo = require('./Data/conn');
const PORT = process.env.PORT || 54321;
const app = express();

app.use(cors());
app.use(express.json());
app.use(require('./routes/recipe'));

// Global error handling
app.use(function (err, _req, res) {
  console.log(`Error stack => ${err.stack}`);
  //res.status(500).send('Something broke!');
});

// perform a database connection when the server starts
dbo.connectToServer(function (err) {
  if (err) {
    console.log(`There was an error: ${err}`);
    process.exit();
  }

  // start the Express server
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
});