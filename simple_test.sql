CREATE TABLE actor (
    actor_id INT PRIMARY KEY AUTO_INCREMENT,
    actor_name VARCHAR(255) NOT NULL,
    actor_birth_year INT,
    actor_nationality VARCHAR(100)
);

INSERT INTO actor (actor_name, actor_birth_year, actor_nationality) VALUES 
('Tom Hanks', 1956, 'American'),
('Brad Pitt', 1963, 'American'),
('Angelina Jolie', 1975, 'American');