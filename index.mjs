import express from 'express';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import ejs from 'ejs'
import bindRoutes from './routes.mjs';

const app = express(); // Initialise Express instance

app.set('view engine', 'ejs'); // Set the Express view engine to expect EJS templates
app.use(cookieParser()); // Bind cookie parser middleware to parse cookies in requests
// eslint-disable-next-line max-len
app.use(express.urlencoded({ extended: false })); // Bind Express middleware to parse request bodies for POST requests
app.use(methodOverride('_method')); // Bind method override middleware to parse PUT and DELETE requests sent as POST requests
app.use(express.static('public')); // Expose the files stored in the public folder
app.use(express.json()); // Parses incoming requests with JSON payloads (transmitted data)

// Bind route definitions to the Express application
bindRoutes(app);

// Set Express to listen on the given port
const PORT = process.env.PORT || 3000;
app.listen(PORT);
