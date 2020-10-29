-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- Link to schema: https://app.quickdatabasediagrams.com/#/d/1q6In7
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.

DROP DATABASE IF EXISTS capstone2;
CREATE DATABASE capstone2;

\c capstone2;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS address;
DROP TABLE IF EXISTS product;
DROP TABLE IF EXISTS cart;
DROP TABLE IF EXISTS order;
DROP TABLE IF EXISTS rating;

CREATE TABLE "users" (
    "id"  SERIAL PRIMARY KEY,
    "username" varchar  UNIQUE NOT NULL,
    "firstname" varchar   NOT NULL,
    "lastname" varchar   NOT NULL,
    "email" varchar   NOT NULL,
    "password" varchar   NOT NULL,
    "is_admin" boolean  DEFAULT TRUE NOT NULL
);

CREATE TABLE "address" (
    "id"  SERIAL PRIMARY KEY,
    "user_id" int   NOT NULL,
    "address" varchar   NOT NULL,
    "city" text   NOT NULL,
    "state" text   NOT NULL,
    "postal_code" varchar   NOT NULL,
    "country" text   NOT NULL
);

CREATE TABLE "product" (
    "id"  SERIAL  PRIMARY KEY,
    "name" varchar   NOT NULL,
    "brand" varchar   NOT NULL,
    "image" varchar   NOT NULL,
    "price" int  DEFAULT 0 NOT NULL,
    "category" text   NOT NULL,
    "count_in_stock" int  DEFAULT 0 NOT NULL,
    "description" varchar   NOT NULL
);

CREATE TABLE "cart" (
    "id"  SERIAL PRIMARY KEY,
    "user_id" int   NOT NULL,
    "product_id" int   NOT NULL,
    "quantity" int   NOT NULL,
    "date" date  DEFAULT CURRENT_DATE
);

CREATE TABLE "order" (
    "id"  SERIAL PRIMARY KEY,
    "user_id" int   NOT NULL,
    "cart_id" int   NOT NULL,
    "order_date" date  DEFAULT CURRENT_DATE
);

CREATE TABLE "rating" (
    "id"  SERIAL PRIMARY KEY,
    "user_id" int   NOT NULL,
    "product_id" int   NOT NULL,
    "value" int   NOT NULL
);

ALTER TABLE "address" ADD CONSTRAINT "fk_address_user_id" FOREIGN KEY("user_id")
REFERENCES "users" ("id") ON DELETE CASCADE;

ALTER TABLE "cart" ADD CONSTRAINT "fk_cart_user_id" FOREIGN KEY("user_id")
REFERENCES "users" ("id") ON DELETE CASCADE;

ALTER TABLE "cart" ADD CONSTRAINT "fk_cart_product_id" FOREIGN KEY("product_id")
REFERENCES "product" ("id") ON DELETE CASCADE;

ALTER TABLE "order" ADD CONSTRAINT "fk_order_user_id" FOREIGN KEY("user_id")
REFERENCES "users" ("id") ON DELETE CASCADE;

ALTER TABLE "order" ADD CONSTRAINT "fk_order_cart_id" FOREIGN KEY("cart_id")
REFERENCES "cart" ("id") ON DELETE CASCADE;

ALTER TABLE "rating" ADD CONSTRAINT "fk_rating_user_id" FOREIGN KEY("user_id")
REFERENCES "users" ("id") ON DELETE CASCADE;

ALTER TABLE "rating" ADD CONSTRAINT "fk_rating_product_id" FOREIGN KEY("product_id")
REFERENCES "product" ("id") ON DELETE CASCADE;

