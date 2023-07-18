const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const User = require('./models/User');
const Post = require('./models/Post');
const bcrypt = require('bcrypt');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
const fs = require('fs');

// const CLIENT_URL = `http://localhost:3000`
const CLIENT_URL = `https://mernblogg.onrender.com/`
const saltRounds = 10; // Number of salt rounds for bcrypt
const secret = 'asdfe45we45w345wegw345werjktjwertkj';
const DB_URL = 'mongodb+srv://rugvedwagh02:rugved76@clusternew.xrsceyc.mongodb.net/?retryWrites=true&w=majority'

app.use(cors({ credentials: true, origin: CLIENT_URL }));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('Successfully connected to database!\n')
}).catch((e) => {
    console.log(e)
});

app.get('/',(req,res)=>{
    res.send('Server is up and running...')    
})

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Generate a salt and hash the password using bcrypt
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user with the provided username and hashed password
        const userDoc = await User.create({
            username,
            password: hashedPassword,
        });

        res.json(userDoc);
    } catch (error) {
        console.error(error);
        res.status(400).json(error);
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the user document in the database based on the provided username
        const userDoc = await User.findOne({ username });

        if (!userDoc) {
            // User not found
            return res.status(404).json('User not found');
        }

        // Compare the entered password with the hashed password from the user document
        const passOk = bcrypt.compareSync(password, userDoc.password);

        if (passOk) {
            // Passwords match, generate a JWT
            const token = jwt.sign(
                { username, id: userDoc._id },
                secret,
                { expiresIn: '24h' }
            );

            // Set the JWT as a cookie and send the user details in the response
            res.cookie('token', token).json({
                id: userDoc._id,
                username,
            });
        } else {
            // Incorrect password
            res.status(400).json('Wrong credentials');
        }
    } catch (error) {
        console.error(error);
        res.status(500).json('Server error');
    }
});

app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, (err, info) => {
        if (err) throw err;
        // res.json(info);
        console.log(info)
    });
});

app.post('/logout', (req, res) => {
    res.cookie('token', '').json('ok');
});

app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);

    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const { title, summary, content } = req.body;
        const postDoc = await Post.create({
            title,
            summary,
            content,
            cover: newPath,
            author: info.id,
        });
        res.json(postDoc);
    });

});


app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
    let newPath = null;
    if (req.file) {
        const { originalname, path } = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
    }

    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const { id, title, summary, content } = req.body;
        try {
            const postDoc = await Post.findById(id);
            const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
            if (!isAuthor) {
                return res.status(400).json('you are not the author');
            }
            postDoc.title = title;
            postDoc.summary = summary;
            postDoc.content = content;
            postDoc.cover = newPath ? newPath : postDoc.cover;
            await postDoc.save();
            res.json(postDoc);
            console.log('Post Updated!')
        } catch (error) {
            res.status(400).json('Error updating post');
        }
    });
});


app.get('/post', async (req, res) => {
    res.json(
        await Post.find()
            .populate('author', ['username'])
            .sort({ createdAt: -1 })
            .limit(20)
    );
});

app.get('/post/:id', async (req, res) => {
    const { id } = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc);
})

app.listen(4000, () => {
    console.log('Server listening at port 4000')
});
