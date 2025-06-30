require('dotenv').config();

const express = require('express');
const app = express();

const jwt = require('jsonwebtoken');
//middleware
app.use(express.json());

let refreshTokens = [];

// Generate a new access token
function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' });
}

// Login endpoint
app.post('/login', (req, res) => {
    // Authenticate User
    const username = req.body.username;
    const user = { name: username };

    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken);
    res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

// Token refresh endpoint
app.post('/token', (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = generateAccessToken({ name: user.name });
        res.json({ accessToken: accessToken });
    });
});

// Logout endpoint
app.delete('/logout', (req, res) => {
    const refreshToken = req.query.token; 
    refreshTokens = refreshTokens.filter(token => token !== refreshToken);
    res.sendStatus(204);
});



const port = 4000;

app.listen(port, () => {
    console.log(`Auth Server running at http://localhost:${port}`);
});
