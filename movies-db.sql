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


-- INSERT INTO users
-- (username, password, firstname, lastname, email)
-- VALUES
-- ("john", "john", "John", "Conner", "john@test.com"),
-- ("billy", "billy", "Billy", "Goldensword", "billy@test.com"),
-- ("clark", "clark", "Clark", "Kent", "clark@superman.com");

-- INSERT INTO movies
-- (movie_id, title, description, image, rating)
-- VALUES
-- (290859, "Terminator: Dark Fate", "Decades after Sarah Connor prevented Judgment Day, a lethal new Terminator is sent to eliminate the future leader of the resistance. In a fight to save mankind, battle-hardened Sarah Connor teams up with an unexpected ally and an enhanced super soldier to stop the deadliest Terminator yet.", "/vqzNJRH4YyquRiWxCCOH0aXggHI.jpg", 6.5),
-- (424, "Schindler's List", "The true story of how businessman Oskar Schindler saved over a thousand Jewish lives from the Nazis while they worked as slaves in his factory during World War II.", "/c8Ass7acuOe4za6DhSattE359gr.jpg", 8.6),
-- (278, "The Shawshank Redemption", "Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison, where he puts his accounting skills to work for an amoral warden. During his long stretch in prison, Dufresne comes to be admired by the other inmates -- including an older prisoner named Red -- for his integrity and unquenchable sense of hope.", "/5KCVkau1HEl7ZzfPsKAPM0sMiKc.jpg", 8.7),
-- (531219, "Roald Dahl's The Witches", "In late 1967, a young orphaned boy goes to live with his loving grandma in the rural Alabama town of Demopolis. As the boy and his grandmother encounter some deceptively glamorous but thoroughly diabolical witches, she wisely whisks him away to a seaside resort. Regrettably, they arrive at precisely the same time that the world's Grand High Witch has gathered.", "/betExZlgK0l7CZ9CsCBVcwO1OjL.jpg", 7);

-- INSERT INTO watchlist
-- (user_id, movie_id)
-- VALUES
-- (1, 424),
-- (1, 278),
-- (1, 531219),
-- (2, 290859),
-- (2, 278),
-- (2, 531219),
-- (3, 278),
-- (3, 290859),
-- (3, 424),
-- (3, 531219);
