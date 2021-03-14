IMDB-Bulk-Lookup
================

A Node.js program that you pass in a file containing movie titles and an api key and it looks them up on 
IMDB and brings back the rating and other stuff. Uses the imdbapi.org API to perform the search.

It ain't perfect but it doesn't do a bad job. Give it good titles and it will do a better job.

Run it like this: 

	> node imdb-bulk-lookup sample_movies.txt ab123456
    
Were *ab123456* is your api key for https://www.omdbapi.com/apikey.aspx FREE! (1,000 daily limit)

Where *sample_movies.txt* format is a tab separated list of movie title and year  - the year is optional


    > Scream Test    [tab] 2020
    > Soul           [tab] 2020
    > The Dissident  [tab] 2020


Or a movie name with the year in parenthesis

    > Scream Test (2020)
    > Soul (2020)
    > The Dissident (2020)

And it will respond with the movie title and IMDB rating while building a CSV spreadsheet named: [timestamp]-results.csv

    Scream Test (2020) 8.6
    Soul (2020) 8.1
    The Dissident (2020) 8.1


The colunmns it returns are

Title,	Year,	imdbID,	Genre,	Rated,	Released,	Runtime,	Director,	Writer,	Actors,	Plot,	Language,	Country,	Awards,	Poster,	Metascore,	imdbRating,	imdbVotes,	Type,	DVD,	BoxOffice,	Production,	Website,	Response

I'm open to suggestions for new features so feel free to submit pulls.

Enjoy, Andy
Thanks to Simon Raik-Allen for the parent repo
