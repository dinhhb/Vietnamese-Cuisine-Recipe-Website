const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
const mainPageRoutes = require("./routes/main-page");
const adminRoutes = require("./routes/admin");
const errorController = require('./controllers/error');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.use((req, res, next) => {
  next();
});

app.use(mainPageRoutes);
app.use("/admin", adminRoutes);

app.get('/500', errorController.get500);

app.use(errorController.get404);

app.use((err, req, res, next) => {
  res.redirect('/500');
});


mongoose
  .connect(
    "mongodb+srv://ty:Dinh2612@cluster0.zx3iodw.mongodb.net/test?retryWrites=true&w=majority"
  )
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
