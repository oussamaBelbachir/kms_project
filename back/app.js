const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/AppError');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const GlobalHandlerErrors = require('./controllers/errorController');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const CLIENT_ENDPOINT = process.env.CLIENT_ENDPOINT;
const CLIENT_PORT = process.env.CLIENT_PORT;

const corsOptions = {
  origin: [`${CLIENT_ENDPOINT}:${CLIENT_PORT}`],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true,
};

app.use(fileUpload());
app.use(cors(corsOptions));

app.use(cookieParser());

// Increase the request size limit (e.g., 10 MB)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const root = require('path').join(__dirname, 'build');
app.use(express.static(root));

app.use(express.json()); //Return middleware that only parses json and only looks at requests where the Content-Type header matches the type option.

const artcileRouter = require('./routes/articleRoutes');
const userRouter = require('./routes/userRoutes');

app.use('/api/v1/articles', artcileRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on the server !`, 404));
});
app.use(GlobalHandlerErrors);

module.exports = app;
