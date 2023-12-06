import express from 'express';
import {resolve, dirname} from 'path';
import {readFile, readdir} from 'fs'
import {fileURLToPath} from 'url';
import * as path from 'path';
// import exphbs from 'express-handlebars';
import bodyParser from 'body-parser';
import fs from 'fs';

const app = express();
const port = 15550;

const __dirname = dirname(fileURLToPath(import.meta.url));

// app.use(express.json());
app.use(express.static(path.join(__dirname)));
app.use(express.json());

let totalRatings = 0;
let currentAverage = 0;

// Sample data for a featured recipe
let featuredRecipe = {
    name: 'Feta Tomato Sandwich',
    averageRating: 0, // Initial average rating
    ratings: [], // Array to store individual ratings
};

//Route handler for root
app.get('/',(req, res)=>{
    res.sendFile(path.join(__dirname, 'home.html'))
})

app.post('/register', (req, res) => {
    // Your registration logic here
    res.json({ message: 'User registered successfully' });
});

app.post('/submit-rating', (req, res) => {
    const { rating } = req.body;

    if (isNaN(rating) || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Invalid rating. Please enter a rating between 1 and 5.' });
    }

    totalRatings++;
    currentAverage = ((currentAverage * (totalRatings - 1)) + rating) / totalRatings;

    res.json({ averageRating: currentAverage.toFixed(2), numberOfRatings: totalRatings });
});

app.post('/login', (req, res) => {
    // Your login logic here
    res.json({ message: 'Login successful' });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});