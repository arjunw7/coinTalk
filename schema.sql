DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS bookmarks;
DROP TABLE IF EXISTS follows;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(55) NOT NULL,
    last_name VARCHAR(55) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(256),
    about TEXT,
    image TEXT,
    blog_title TEXT
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(60) NOT NULL,
    post_text TEXT,
    post_picture TEXT,
    author_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bookmarks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    post_id INTEGER NOT NULL
);

CREATE TABLE follows (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    author INTEGER NOT NULL
);
