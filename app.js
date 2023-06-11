const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const mongoConnect = require('./utils/database').mongoConnect;

const app = express();

app.set('view engine', 'ejs');
const mainPageRoutes = require('./routes/main-page');
const adminRoutes = require('./routes/admin');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.use((req, res, next) => {
    next();
});

app.use(mainPageRoutes);
app.use('/admin', adminRoutes);

mongoConnect(() => {
    app.listen(3000);
})