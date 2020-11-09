DROP DATABASE IF EXISTS movies_db;
CREATE DATABASE movies_db;

\c movies_db;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS movies;
DROP TABLE IF EXISTS watchlist;

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "username" varchar UNIQUE,
  "firstname" varchar,
  "lastname" varchar,
  "email" varchar UNIQUE,
  "password" varchar
);

CREATE TABLE "movies" (
  "id" int PRIMARY KEY,
  "title" varchar,
  "description" varchar,
  "image" varchar,
  "rating" decimal
);

CREATE TABLE "watchlist" (
  "id" SERIAL PRIMARY KEY,
  "user_id" int,
  "movie_id" int
);

ALTER TABLE "watchlist" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE;

ALTER TABLE "watchlist" ADD FOREIGN KEY ("movie_id") REFERENCES "movies" ("id") ON DELETE CASCADE;
