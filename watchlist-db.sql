DROP DATABASE IF EXISTS watchlist_db;
CREATE DATABASE watchlist_db;

\c watchlist_db;

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
  "original_title" varchar,
  "overview" varchar,
  "poster_path" varchar,
  "vote_average" decimal,
  "release_date" varchar,
  "runtime" int,
  "backdrop_path" varchar,
  "tagline" varchar
);

CREATE TABLE "watchlist" (
  "id" SERIAL PRIMARY KEY,
  "user_id" int,
  "movie_id" int
);

ALTER TABLE "watchlist" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE;

ALTER TABLE "watchlist" ADD FOREIGN KEY ("movie_id") REFERENCES "movies" ("id") ON DELETE CASCADE;
