require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
const authRoutes = require('./routes/auth.routes');
const usersRoutes = require('./routes/users.routes');
const profileRoutes = require('./routes/profile.routes');
const listingsRoutes = require('./routes/listings.routes');
const statesRoutes = require('./routes/states.routes');
const citiesRoutes = require('./routes/cities.routes');
 
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1', profileRoutes);
app.use('/api/v1/listings', listingsRoutes);
app.use('/api/v1/states', statesRoutes);
app.use('/api/v1/cities', citiesRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Findora API 🚀" });
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});

app.use('/', indexRouter);

module.exports = app;
