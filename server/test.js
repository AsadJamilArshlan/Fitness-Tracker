const mongoose = require('mongoose');
const uri = "mongodb://asadjamilarshlan80_db_user:1234@ac-pqeppkm-shard-00-00.crouhsg.mongodb.net:27017,ac-pqeppkm-shard-00-01.crouhsg.mongodb.net:27017,ac-pqeppkm-shard-00-02.crouhsg.mongodb.net:27017/fitness_tracker?ssl=true&replicaSet=atlas-pqeppkm-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose.connect(uri)
  .then(() => {
    console.log("Connected successfully");
    process.exit(0);
  })
  .catch(err => {
    console.error("Connection failed", err);
    process.exit(1);
  });
