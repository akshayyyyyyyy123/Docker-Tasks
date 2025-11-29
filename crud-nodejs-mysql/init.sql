-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS mydb;

-- Use the database
USE mydb;

-- Drop users table if it already exists (optional, for clean start)
DROP TABLE IF EXISTS users;

-- Create the users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE
);

-- Insert sample users
INSERT INTO users (name, email) VALUES
('Akshay', 'akshay@example.com'),
('Rahul', 'rahul@example.com'),
('John', 'john@example.com');
