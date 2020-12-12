# The Watchlist

**App Deployed at**
[theWatchlist]()

## Description

This app is designed to allow users to save movies to a watchlist. It could be a new movie, an older movie or any movie the user would like to watch in the future. Save a movie list to your watchlist. It makes it easier to choose a movie for those “movie nights”. The app also allows users to view trailers (if available) for those movies they would like to add to their watchlist.

The app loads with the most popular movies (according to the TMDB API) with 20 results per page. Users can choose from the 'most popular' movies or search for a particular movie by using the search input. To load more results, click on the load more button. More details on the movie can be found by clicking on the movie image. The movie information page shows the title, a short decription, the director/s, release date and runtime. The users can then add the movie to the watchlist from there, as well as be able to view the trailer.

To save a movie to the watchlist, the user needs to register/login. Once the user is authenticated, The user will be able to save any movie title to the database. Users can access their watchlist list by clicking on the watchlist link on the header.

### Features

- Search for movies anonymously (searches can be made without signing up).
- Get movie information anonymously.
- Watch trailers anonymously (no login required).
- Add movies to a watchlist. (User must sign up for this feature).
- Create secure user accounts using the B-crypt hash.
- Users can add and remove movies from their watchlist.

### Demo

![theWatchlist Demo]()

### Data

The Watchlist app uses multiple endpoints from the TMDB api.

### Schema Design

![Schema Design](./images/WatchlistSchema.png)

### Technology Used

**Front End**

- ReactJS
- Redux
- React Router
- Formik
- Yup
- React Youtube
- Movie-Trailer
- React Styled Components
- React Material UI
- React FontAwesome
- Axios

**Backend**

- NodeJS
- PostgreSQL
- ExpressJS
- node-postgres
- BCrypt
- Axios

**Deployment**

- Deployed Frontend on Netlify
- Deployed Backend on Heroku Server

### Improve or Contribute

Feel free to improve or contribute on this. Pull requests are always welcome!

### Author

- [Muhammad Qadir](https://github.com/mahdimq)
