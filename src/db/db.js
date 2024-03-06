const mongoose = require("mongoose");

const db = () => {
  mongoose
    .connect(process.env.DB)
    .then(() => {
      console.log("Databazaga ulandik :)");
    })
    .catch((err) => {
      console.log("Databazada xatolik :(" , err);
    });
};

module.exports = db;
 