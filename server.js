// server.js

// init project
const express = require("express");
const bodyParser = require("body-parser");
const { Sequelize, Model, DataTypes } = require("sequelize");
const app = express();
const fs = require("fs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// init sqlite db
const dbFile = "./.data/sqlite275.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbFile);
const sequelize = new Sequelize("sqlite::memory:");

try {
  sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

class Category extends Model {}
Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    description: DataTypes.TEXT
  },
  { sequelize, modelName: "category" }
);

(async () => {
  await sequelize.sync();
  
  try {
    const ticket = await Category.build({
      id: 'High School',
      description: "0 Stars"
    });
    console.log(ticket.toJSON());
    await ticket.save();
    console.log("Ticket was saved to the database!");
  } catch (err) {
    console.log(err);
  }
  
  try {
    const clothing = await Category.build({
      id: 'Undergraduate Student',
      description: "1 Star"
    });
    console.log(clothing.toJSON());
    await clothing.save();
    console.log("Clothing was saved to the database!");
  }
  catch (err) {
    console.log(err);
  }
  
  try {
    const furniture = await Category.build({
      id: 'Graduate Student',
      description: "2 Stars"
    });
    console.log(furniture.toJSON());
    await furniture.save();
    console.log("furniture was saved to the database!");
  }
  catch (err) {
    console.log(err);
  }
  
  try {
    const dorm_buys = await Category.build({
      id: 'Teaching Assistant',
      description: "3 Stars"
    });
    console.log(dorm_buys.toJSON());
    await dorm_buys.save();
    console.log("Dorm Buy was saved to the database!");
  }
  catch (err) {
    console.log(err);
  }
  
  try {
    const electronics = await Category.build({
      id: "Professor",
      description: "4 Stars"
    });
    console.log(electronics.toJSON());
    await electronics.save();
    console.log("Electronic was saved to the database!");
  }
  catch (err) {
    console.log(err);
  }
  
  try {
    const textbooks = await Category.build({
      id: 'In Workforce',
      description: "5 Stars!"
    });
    console.log(textbooks.toJSON());
    await textbooks.save();
    console.log("Textbook was saved to the database!");
  }
  catch (err) {
    console.log(err);
  }
  
  try {
    const tutors = await Category.build({
      id: 6,
      description: "Tutor"
    });
    console.log(tutors.toJSON());
    await tutors.save();
    console.log("Tutor was saved to the database!");
  }
  catch (err) {
    console.log(err);
  }
})();

sequelize.sync();

// if ./.data/sqlite.db does not exist, create it, otherwise print records to console
db.serialize(() => {
  if (!exists) {
    db.run(
      "CREATE TABLE Tutors (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, category int(22), contact TEXT, datejoined TEXT)"
    );
    console.log("New table Tutors created");
  } else {
    console.log('Database "Tutors" ready to go!');
    //
    db.run(`PRAGMA read_uncommitted = 0`);
    // start indexes
    db.run(`CREATE INDEX IF NOT EXISTS ind_one ON Tutors(id)`);
    // end indexes
  }
});

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(`${__dirname}/views/index.html`);
});

// endpoint to get all the user in the database
app.get("/getTutors", (request, response) => {
  db.all("SELECT id,title,description, category, contact, datejoined from Tutors", (err, rows) => {
    response.send(JSON.stringify(rows));
  });
});

// endpoint to add a user to the database
app.post("/addTutor", (request, response) => {
  console.log(`add to tutors table ${request.body.item}`);
  if (!process.env.DISALLOW_WRITE) {
    const cleansedtitle = cleanseString(request.body.title);
    const cleanseddescription = cleanseString(request.body.description);
    const cleansedcontact = cleanseString(request.body.contact);
    const cleansedcategory = cleanseString(request.body.category);
    const cleanseddate = cleanseString(request.body.date);
    db.run(`BEGIN TRANSACTION EXCLUSIVE;`);
    db.run(
      `INSERT INTO Tutors (title, description, category, contact, datejoined) VALUES (?,?,?,?,?)`,
      cleansedtitle,
      cleanseddescription,
      cleansedcategory,
      cleansedcontact,
      cleanseddate,
      error => {
        if (error) {
          response.send({ message: "error!" });
        } else {
          response.send({ message: "success" });
        }
      }
    );
    db.run(`COMMIT;`);
  }
});

/////////

/////////

// helper function that prevents html/css/script malice
const cleanseString = function(string) {
  return string.replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

// listen for requests
var listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});
