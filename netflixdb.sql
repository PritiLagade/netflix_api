use netflix;

CREATE TABLE users (
id INT PRIMARY KEY AUTO_INCREMENT,
email VARCHAR(50) UNIQUE NOT NULL,
password VARCHAR(25) NOT NULL,
city varchar(50),
is_active boolean default(1),
created_at datetime default current_timestamp,
updated_at datetime on update current_timestamp
);


CREATE TABLE profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    type ENUM ('KID', 'ADULT') NOT NULL,
    created_at datetime default current_timestamp,
    updated_at datetime on update current_timestamp,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);



CREATE TABLE actors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    is_active boolean not null,
    created_at datetime default current_timestamp,
    updated_at datetime on update current_timestamp
);

CREATE TABLE casts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    actor_id INT,
    FOREIGN KEY (actor_id) REFERENCES actors(id),
    created_at datetime default current_timestamp,
    updated_at datetime on update current_timestamp
);

CREATE TABLE videos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description varchar(100) not null,
    is_active boolean not null,
    created_at datetime default current_timestamp,
    updated_at datetime on update current_timestamp,
	user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    cast_id INT,
    FOREIGN KEY (cast_id) REFERENCES casts(id)
);



CREATE TABLE videostatus (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM ('In Process', 'Completed') NOT NULL,
    created_at datetime default current_timestamp,
    updated_at datetime on update current_timestamp,
	user_id INT,
   FOREIGN KEY (user_id) REFERENCES users(id)
);