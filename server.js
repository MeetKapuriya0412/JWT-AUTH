require('dotenv').config()

const express = require('express');
const app = express();

const jwt = require('jsonwebtoken');
//middleware
app.use(express.json());

const port = 3000;
const posts = [
    {
        "username": 'kyle',
        "title": "post1"
    },
    {
        "username": 'meet',
        "title": "post2"
    },
    {
        "username": 'chapli',
        "title": 'post3'
    }
]

app.get('/posts', authenticateToken, (req, res) => {
    res.json(posts.filter(post => post.username == req.user.name));
});



function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(401).json({ message: "No token provided" });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid token" });

        req.user = user;
        next();
    });
}



app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});