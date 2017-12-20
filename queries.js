const spicedPg = require('spiced-pg');
const url = require('./amaz.json')

let dbUrl;
if (process.env.DATABASE_URL) {
    dbUrl = process.env.DATABASE_URL
} else {
    const secrets = require('./secrets.json');
    dbUrl = `postgres:${secrets.user}:${secrets.password}@localhost:5432/footyblogs`;
}

var db = spicedPg(dbUrl);

//------------------------------------------------------------------------------
//Creates a new user:
function register(first_name, last_name, email, password, image) {
    return db.query(`INSERT INTO users (first_name, last_name, email, password, image)
    VALUES ($1, $2, $3, $4, $5)`, [first_name, last_name, email, password, image])
}

//Gets the information for the login:
function getCredentials(email) {
    return db.query(`SELECT id, first_name, last_name, email, password
        FROM users
        WHERE email = $1`, [email])
        .then((results) => {
            return results.rows[0];
        });
}

//Get user profile:
function getProfile(user_id) {
    return db.query(`SELECT users.id, first_name, last_name, email, image, about, blog_title, author
        FROM users
        LEFT JOIN follows
        ON (author = $1)
        WHERE users.id = $1`, [user_id])
        .then((results) => {
            if(results.rows[0].image) {
                results.rows[0].image = url.url + results.rows[0].image
            }
            return results.rows[0];
        });
}

//Update about/bio section in user profile:
function updateAbout(about, id) {
    return db.query(`UPDATE users
        SET about = $1
        WHERE id = $2`, [about, id])
        .then((results) => {
            return results.rows[0];
        });
}

//Start a blog:
function createBlog(blog_title, id) {
    return db.query(`UPDATE users
        SET blog_title = $1
        WHERE id = $2`, [blog_title, id])
        .then((results) => {
            return results.rows[0];
        });
}

//Change logged-in user profile picture:
function changeProfilePic(image, id) {
    return db.query(`UPDATE users
        SET image = $1
        WHERE id = $2
        RETURNING image, id`, [image, id])
        .then((results) => {
            console.log('Profile picture successfully updated!');
        });
}

//Create a new post:
function createPost(title, post_text, author_id, post_picture) {
    return db.query(`INSERT INTO posts (title, post_text, author_id, post_picture)
    VALUES ($1, $2, $3, $4)`, [title, post_text, author_id, post_picture])
}

//Update post_picture:
function setPostPic(post_picture, author_id) {
    return db.query(`UPDATE posts
        SET post_picture = $1
        WHERE id = $2
        RETURNING post_picture`, [post_picture, author_id])
        .then((results) => {
            console.log('Profile picture successfully updated!');
        });
}

//Get all user posts to display at user-profile:
function getUserPosts(author_id) {
    return db.query(`SELECT * FROM posts
        WHERE author_id = $1
        ORDER BY created_at DESC`, [author_id])
        .then((results) => {
            for (var i = 0; i < results.rows.length; i++) {
                if (results.rows[i].post_picture) {
                    results.rows[i].post_picture = url.url + results.rows[i].post_picture;
                }
            }
        return results.rows;
    });
}

//Get all posts to display at home page:
function getAllPosts() {
    return db.query(`SELECT users.id, first_name, last_name, image, blog_title, title, posts.id AS postid, created_at, post_picture, author_id
        FROM users
        JOIN posts
        ON (users.id = author_id)
        ORDER BY created_at DESC`)
        .then((results) => {
            for (var i = 0; i < results.rows.length; i++) {
                if (results.rows[i].post_picture) {
                    results.rows[i].post_picture = url.url + results.rows[i].post_picture;
                }
                if (results.rows[i].image) {
                    results.rows[i].image = url.url + results.rows[i].image;
                }
            }
        return results.rows;
    });
}

//Get single post:
function readPost(id, user_id) {
    return db.query(`SELECT users.id, first_name, last_name, image, blog_title, title, created_at, post_picture, author_id, post_text, post_id, user_id, about
        FROM users
        JOIN posts
        ON (users.id = author_id AND posts.id = $1)
        LEFT JOIN bookmarks
        ON (post_id = $1 AND user_id = $2)`, [id, user_id])
        .then((results) => {
            if (results.rows[0].post_picture) {
                results.rows[0].post_picture = url.url + results.rows[0].post_picture;
            }
            if (results.rows[0].image) {
                results.rows[0].image = url.url + results.rows[0].image;
            }
        return results.rows[0];
    });
}

//Add a post to bookmarks:
function addToFavorites(user_id, post_id) {
    return db.query(`INSERT INTO bookmarks (user_id, post_id)
    VALUES ($1, $2)`, [user_id, post_id])
}

//Delete from bookmarks:
function removeFromFavorites(user_id, post_id) {
    return db.query(`DELETE FROM bookmarks
        WHERE (user_id = $1 AND post_id = $2)`, [user_id, post_id])
        .then(() => {
            return 'Sucessfully deleted';
        })
}

//Get bookmarks:
function getBookmarks(user_id) {
    return db.query(`SELECT first_name, last_name, image, blog_title, title, created_at, post_picture, author_id, post_text, post_id, user_id, posts.id AS postid
        FROM bookmarks
        JOIN posts
        ON (post_id = posts.id AND user_id = $1)
        LEFT JOIN users
        ON (author_id = users.id)
        ORDER BY created_at DESC`, [user_id])
        .then((results) => {
            for (var i = 0; i < results.rows.length; i++) {
                if (results.rows[i].post_picture) {
                    results.rows[i].post_picture = url.url + results.rows[i].post_picture;
                }
                if (results.rows[i].image) {
                    results.rows[i].image = url.url + results.rows[i].image;
                }
            }
        return results.rows;
    });
}

//Follow author:
function follow(user_id, author) {
    return db.query(`INSERT INTO follows (user_id, author)
    VALUES ($1, $2)`, [user_id, author])
}

//Unfollow
function unFollow(user_id, author) {
    return db.query(`DELETE FROM follows
    WHERE (user_id = $1 AND author = $2)`, [user_id, author])
}

//Get favorite authors:
function getAuthors(user_id) {
    return db.query(`SELECT users.id, first_name, last_name, image, about, blog_title, author, user_id, follows.id AS followid
        FROM follows
        JOIN users
        ON (users.id = author AND user_id = $1)`, [user_id])
        .then((results) => {
            for (var i = 0; i < results.rows.length; i++) {
                if (results.rows[i].image) {
                    results.rows[i].image = url.url + results.rows[i].image;
                }
            }
        return results.rows;
    });
}

//EXPORTS-----------------------------------------------------------------------
//------------------------------------------------------------------------------
module.exports = {
    register: register,
    getCredentials: getCredentials,
    getProfile: getProfile,
    updateAbout: updateAbout,
    createBlog: createBlog,
    changeProfilePic: changeProfilePic,
    createPost: createPost,
    setPostPic: setPostPic,
    getAllPosts: getAllPosts,
    getUserPosts: getUserPosts,
    readPost: readPost,
    addToFavorites: addToFavorites,
    removeFromFavorites: removeFromFavorites,
    getBookmarks: getBookmarks,
    follow: follow,
    unFollow: unFollow,
    getAuthors: getAuthors
}
