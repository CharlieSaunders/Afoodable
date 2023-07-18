const { MongoClient, ServerApiVersion } = require('mongodb');
const connectionString = "mongodb+srv://cs1995:86gmffQY4eNJlV94@cs1995-cluster.idacbvy.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1
});

let dbConnection;

module.exports = {
  connectToServer: function (callback) {
    client.connect(function (err, database) {
      console.log("Attempting connection from conn.js");
      if (err || !database) {
        return callback(err);
      }
      const environment = process.env.NODE_ENV === "prod" ? "afoodable" : "afoodable-dev";
      console.log(`No error. DB is ${environment}`);
      dbConnection = database.db(environment);
      console.log('Successfully connected to MongoDB.');
      return callback();
    });
  },

  getDb: function () {
    return dbConnection;
  },
};
