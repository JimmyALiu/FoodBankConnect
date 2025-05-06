// Import the express in typescript file
import express from 'express';
 
// Initialize the express engine
const app: express.Application = express();
 
const port: number = 3000;
 
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