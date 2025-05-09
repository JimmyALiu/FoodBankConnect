// Import the express in typescript file
import express from 'express';
 
// Initialize the express engine
const app: express.Application = express();

const clientPort: number = 5173;
const port: number = 3000;

// set up CORS to only allow requests from our frontend and nowhere else
const cors = require("cors");
const corsOptions = {
    origin: ["http://localhost:5173"],
}
app.use(cors(corsOptions));
 
// Handling '/' Request
app.get('/', (_req, _res) => {
    _res.send("TypeScript With Express");
}); 
 
// Server setup
// will run once the server starts
app.listen(port, () => {
    console.log(`TypeScript with Express 
         http://localhost:${port}/`);
});