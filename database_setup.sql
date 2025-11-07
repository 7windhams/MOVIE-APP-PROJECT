-- Run this in MySQL to create your movie database

CREATE DATABASE IF NOT EXISTS movie_database;
USE movie_database;

-- Create basic tables for testing
CREATE TABLE IF NOT EXISTS actor (
    actor_id INT PRIMARY KEY AUTO_INCREMENT,
    actor_name VARCHAR(255) NOT NULL,
    actor_birth_year INT,
    actor_nationality VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS director (
    director_id INT PRIMARY KEY AUTO_INCREMENT,
    director_name VARCHAR(255) NOT NULL,
    director_birth_year INT,
    director_nationality VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS genre (
    genre_id INT PRIMARY KEY AUTO_INCREMENT,
    genre_name VARCHAR(100) NOT NULL,
    genre_description TEXT
);

CREATE TABLE IF NOT EXISTS production (
    production_id INT PRIMARY KEY AUTO_INCREMENT,
    production_name VARCHAR(255) NOT NULL,
    production_founded_year INT,
    production_headquarters VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS streaming_platform (
    streaming_platform_id INT PRIMARY KEY AUTO_INCREMENT,
    streaming_platform_name VARCHAR(255) NOT NULL,
    streaming_platform_launch_year INT,
    streaming_platform_subscription_cost DECIMAL(10,2)
);

CREATE TABLE IF NOT EXISTS movie (
    movie_id INT PRIMARY KEY AUTO_INCREMENT,
    movie_title VARCHAR(255) NOT NULL,
    movie_release_year INT,
    movie_runtime INT,
    movie_rating DECIMAL(3,1),
    director_id INT,
    production_id INT,
    FOREIGN KEY (director_id) REFERENCES director(director_id),
    FOREIGN KEY (production_id) REFERENCES production(production_id)
);

-- Pivot tables for many-to-many relationships
CREATE TABLE IF NOT EXISTS movie_actor (
    movie_id INT,
    actor_id INT,
    PRIMARY KEY (movie_id, actor_id),
    FOREIGN KEY (movie_id) REFERENCES movie(movie_id),
    FOREIGN KEY (actor_id) REFERENCES actor(actor_id)
);

CREATE TABLE IF NOT EXISTS movie_genre (
    movie_id INT,
    genre_id INT,
    PRIMARY KEY (movie_id, genre_id),
    FOREIGN KEY (movie_id) REFERENCES movie(movie_id),
    FOREIGN KEY (genre_id) REFERENCES genre(genre_id)
);

CREATE TABLE IF NOT EXISTS movie_streaming_platform (
    movie_id INT,
    streaming_platform_id INT,
    PRIMARY KEY (movie_id, streaming_platform_id),
    FOREIGN KEY (movie_id) REFERENCES movie(movie_id),
    FOREIGN KEY (streaming_platform_id) REFERENCES streaming_platform(streaming_platform_id)
);

-- Insert some test data
INSERT INTO actor (actor_name, actor_birth_year, actor_nationality) VALUES
('Tom Hanks', 1956, 'American'),
('Leonardo DiCaprio', 1974, 'American'),
('Meryl Streep', 1949, 'American');

INSERT INTO director (director_name, director_birth_year, director_nationality) VALUES
('Christopher Nolan', 1970, 'British'),
('Steven Spielberg', 1946, 'American'),
('Martin Scorsese', 1942, 'American');

INSERT INTO genre (genre_name, genre_description) VALUES
('Action', 'High energy films with lots of excitement'),
('Drama', 'Character-driven stories with emotional depth'),
('Comedy', 'Films designed to make audiences laugh');

SELECT 'Database setup complete!' AS status;