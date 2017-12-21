const express = require('express');
const app = express();
const compression = require('compression');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const auth = require('./auth.js');
const db = require('./queries.js');
const secrets = require('./secrets.json');
const path = require('path');
const multer = require('multer');
const uidSafe = require('uid-safe');
const s3 = require('./s3.js');
const url = require('./amaz.json')
const csurf = require('csurf');

//Middleware -------------------------------------------------------------------
app.use(compression());

//Test to see if we're in production:
if (process.env.NODE_ENV != 'production') {
    app.use('/bundle.js', require('http-proxy-middleware')({
        target: 'http://localhost:8081/'
    }));
}

app.use(express.static('./public'));

let sessionSecret;
if (process.env.DATABASE_URL) {
    sessionSecret = process.env.SESSION_SECRET
} else {
    const secrets = require('./secrets.json');
    sessionSecret = secrets.secret;
}

app.use(cookieSession({
    secret: sessionSecret,
    maxAge: 1000 * 60 * 60 * 24 * 14
}));

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

app.use(csurf());

app.use((req, res, next) => {
    res.cookie('myob', req.csrfToken());
    next();
});

var diskStorage = multer.diskStorage({
  filename: (req, file, callback) => {
    uidSafe(24).then((uid) => {
      callback(null, uid + path.extname(file.originalname));
    });
  }
});

var uploader = multer({
  storage: diskStorage,
  limits: {
    fileSize: 2097152
  }
});

var placeholderImage = '5Ay09zB1fS65626r88_9CNc8GelKjV7Z.png';
var postPlaceholder = '5eRDrqq8rsfJD6vii39cAmpmzfLRXs4i.jpg';
//------------------------------------------------------------------------------
//FUNCTIONS---------------------------------------------------------------------
function checkForSession(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/welcome/');
    }
}

function checkForUser(req, res, next) {
    if (req.session.user) {
        res.redirect('/');
    } else {
        next();
    }
}

//------------------------------------------------------------------------------
//POST REQUESTS-----------------------------------------------------------------
//Register new user:
app.post('/register', (req, res) => {
    auth.hashPassword(req.body.password)
    .then((hashed) => {
        return db.register(req.body.first_name, req.body.last_name, req.body.email, hashed, placeholderImage)
        .then((results) => {
            db.getCredentials(req.body.email)
            .then((creds) => {
                req.session.user = {
                    id: creds.id,
                    first_name: creds.first_name,
                    last_name: creds.last_name,
                    email: creds.email
                }
                res.json({
                    success: true
                })
            })
        })
    .catch((err) => {
        console.log(err);
        })
    })
})

//Login:
app.post('/login', (req, res) => {
    return db.getCredentials(req.body.email)
    .then((creds) => {
        return auth.checkPassword(req.body.password, creds.password)
        .then((match) => {
            if (match) {
                req.session.user = {
                    id: creds.id,
                    first_name: creds.first_name,
                    last_name: creds.last_name,
                    email: creds.email
                }
                res.json({
                    success: true
                })
            }
        })
        .catch((err) => {
            console.log(err);
        })
    })
})

//Picture upload:
app.post('/upload', uploader.single('file'), (req, res) => {
    if (req.file) {
        s3.upload(req.file)
        .then(() => {
            db.changeProfilePic(req.file.filename, req.session.user.id)
            .then(() => {
                res.json({
                    image: url.url + req.file.filename
                })
            })
        })
        .catch((err) => {
            console.log(err);
        })
    }
})

//Edit About Me:
app.post('/about', (req, res) => {
    return db.updateAbout(req.body.about, req.session.user.id)
    .then(() => {
        res.json({
            success: true,
            about: req.body.about
        })
    })
    .catch((err) => {
        console.log(err);
    })
})

//Start a blog:
app.post('/create-blog', (req, res) => {
    return db.createBlog(req.body.blog_title, req.session.user.id)
    .then(() => {
        res.json({
            success: true,
            blog_title: req.body.blog_title
        })
    })
    .catch((err) => {
        console.log(err);
    })
})

//Create new post:
app.post('/post', (req, res) => {
    return db.createPost(req.body.title, req.body.post_text, req.session.user.id, postPlaceholder)
    .then(() => {
        res.json({
            success: true
        })
    })
    .catch((err) => {
        console.log(err);
    })
})

//Upload post picture:
app.post('/post-pic', uploader.single('file'), (req, res) => {
    if (req.file) {
        s3.upload(req.file)
        .then(() => {
            db.setPostPic(req.file.filename, req.session.user.id)
            .then(() => {
                res.json({
                    post_picture: url.url + req.file.filename
                })
            })
        })
        .catch((err) => {
            console.log(err);
        })
    }
})

//Add to bookmarks:
app.post('/favorites/:id', (req, res) => {
    db.addToFavorites(req.session.user.id, req.params.id)
    .then((resp) => {
        res.json({
            success: true
        })
    })
    .catch((err) => {
        console.log(err);
    })
})

//Remove from bookmarks:
app.post('/remove-from-favorites/:id', (req, res) => {
    db.removeFromFavorites(req.session.user.id, req.params.id)
    .then((resp) => {
        res.json({
            success: true
        })
    })
    .catch((err) => {
        console.log(err);
    })
})

//Follow author:
app.post('/follow-request/:id', (req, res) => {
    db.follow(req.session.user.id, req.params.id)
    .then((resp) => {
        res.json({
            success: true
        })
    })
    .catch((err) => {
        console.log(err);
    })
})

//Stop following author:
app.post('/unfollow-request/:id', (req, res) => {
    db.unFollow(req.session.user.id, req.params.id)
    .then((resp) => {
        res.json({
            success: true
        })
    })
    .catch((err) => {
        console.log(err);
    })
})

//Post a comment:
app.post('/comment/:id', (req, res) => {
    console.log(req.body.commentData);
    db.postComment(req.session.user.id, req.params.id, req.body.commentData)
    .then((results) => {
        res.json({
            success: true
        })
    })
    .catch((err) => {
        console.log(err);
    })
})
//------------------------------------------------------------------------------
//GET REQUESTS------------------------------------------------------------------
app.get('/get-comments/:id', (req, res) => {
    db.getComments(req.params.id)
    .then((results) => {
        res.json({
            results
        })
    })
})

app.get('/following/', (req, res) => {
    db.getAuthors(req.session.user.id)
    .then((results) => {
        res.json({
            results
        })
    })
    .catch((err) => {
        console.log(err);
    })
})

app.get('/favorites/', (req, res) => {
    db.getBookmarks(req.session.user.id)
    .then((results) => {
        res.json({
            results
        })
    })
    .catch((err) => {
        console.log(err);
    })
})

app.get('/single-post/:id', (req, res) => {
    db.readPost(req.params.id, req.session.user.id)
    .then((results) => {
        res.json({
            results
        })
    })
    .catch((err) => {
        console.log(err);
    })
})

app.get('/other-user/:id', (req, res) => {
    db.getProfile(req.params.id)
    .then((results) => {
        if (req.session.user.id == req.params.id) {
            res.json({
                isLoggedInUser: true
            })
        } else {
            req.session.otherUser = {
                id: req.params.id
            }
            db.getUserPosts(req.session.otherUser.id)
            .then((userPosts) => {
                res.json({
                    results,
                    userPosts
                })
            })
            .catch((err) => {
                console.log(err);
            })
        }
    })
});

app.get('/all-posts', (req, res) => {
    return db.getAllPosts()
    .then((posts) => {
        res.json({
            posts
        })
    })
    .catch((err) => {
        console.log(err);
    })
})

app.get('/user-posts', (req, res) => {
    return db.getUserPosts(req.session.user.id)
    .then((myPosts) => {
        res.json({
            myPosts
        })
    })
    .catch((err) => {
        console.log(err);
    })
})

app.get('/profile', (req, res) => {
    return db.getProfile(req.session.user.id)
    .then((results) => {
        res.json({
            results
        })
    })
    .catch((err) => {
        console.log(err);
    })
})

app.get('/logout', (req, res) => {
    req.session = null;
    res.redirect('/welcome/');
});

app.get('/welcome/', checkForUser, (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('*', checkForSession, (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(8080, () => {
    console.log("I'm listening")
});
