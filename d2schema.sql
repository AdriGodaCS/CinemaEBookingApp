create database cinemaEBooking; 

use cinemaEBooking; 

CREATE TABLE movies ( 

    movie_id INT AUTO_INCREMENT PRIMARY KEY, 

    title VARCHAR(255) NOT NULL, 

    genre VARCHAR(100) NOT NULL, 

    rating VARCHAR(10), 

    description TEXT, 

    poster_url TEXT, 

    trailer_url TEXT, 

    director TEXT, 

    producer TEXT, 

    movie_cast TEXT, 

    status ENUM('Currently Running', 'Coming Soon') NOT NULL 

); 

 

INSERT INTO movies  

  

(title, genre, rating, description, poster_url, trailer_url, director, producer, movie_cast, status)  

  

VALUES  

  

('Spider-Man: Brand New Day', 

'Action', 

'PG-13', 

'Fighting crime full-time as Spider-Man in a world that doesn''t remember him—and the pressure of seeing his old friends move on without him—sparks a change in Peter Parker he may not have the power to control. But that transformation might also be the only thing that can stop a shocking new threat to the city and those he loves - a powerful villain no one can even see.', 

'https://www.themoviedb.org/t/p/w1280/yyB2VJEW3an2xCdcYCPQhn9QERR.jpg', 

'https://www.youtube.com/embed/62bIsvRcPv0?si=_2sG99NQ38WxV4mz', 

'Destin Daniel Cretton', 

'Amy Pascal', 

'Stan Lee, Tom Holland, Zendaya', 

'Currently Running'), 

 

('The Odyssey', 

'Adventure', 

'R', 

'Odysseus, the legendary King of Ithaca, embarks on a long and perilous journey home following the Trojan War. Throughout his voyage, he is forced to confront the whims of gods, mythological monsters, and trials that stretch both his cunning and his humanity to the breaking point. ', 

'https://www.themoviedb.org/t/p/w1280/5rhTDKUhPYvpdQIijFIs5VoWsON.jpg', 

'https://www.youtube.com/embed/Mzw2ttJD2qQ?si=rpcWvc4Befeo5LK4', 

'Christopher Nolan', 

'Emma Thomas', 

'Matt Damon, Tom Holland, Robert Pattinson', 

'Currently Running'), 

 

 

 

 

 

('The End of Oak Street', 

'Science-Fiction', 

'PG-13', 

'After a mysterious cosmic event rips Oak Street from suburbia and transports their neighborhood to someplace unknown, the Platt family soon discovers that their very survival depends on them sticking together as they navigate their now unrecognizable surroundings.', 

'https://www.themoviedb.org/t/p/w1280/fYXqpgPmHMphSF2W30GbTeJVIa5.jpg', 

'https://www.youtube.com/embed/3oB9AxspVow?si=UJHcE-wXq1Er8lCo', 

'David Robert Mitchell', 

'J.J Abrams', 

'Anne Hathaway, Ewan McGregor, Christian Convery', 

'Currently Running'), 

 

('Backrooms', 

'Horror', 

'R', 

'A strange doorway appears in the basement of a furniture showroom.', 

'https://www.themoviedb.org/t/p/w1280/rhGx6E3qRNMgj3i5su2oukNHwIQ.jpg', 

'https://www.youtube.com/embed/wek9dIw2uVM?si=VvLQkpfoQntMQOj5', 

'Kane Parsons', 

'Kyle Godfrey', 

'Chiwetel Ejiofor, Renate Reinsve, Mark Duplass', 

'Currently Running'), 

 

 

 

 

('Toy Story 5', 

'Comedy', 

'PG', 

'When Bonnie receives a Lilypad tablet as a gift and becomes obsessed, Buzz, Woody, Jessie and the rest of the gang''s jobs become exponentially harder when they have to go head to head with the all-new threat to playtime.', 

'https://www.themoviedb.org/t/p/w1280/sfQtVlIHljToOwYjhe21KPGzZWK.jpg', 

'https://www.youtube.com/embed/c51ND9Hdbw0?si=KiCjnh5g1VApdqZt', 

'Andrew Stanton', 

'Lindsey Collins', 

'Tom Hanks, Joan Cusack, Tim Allen', 

'Currently Running'), 

 

('Resident Evil', 

'Horror', 

'R', 

'Bryan, a medical courier, unwittingly finds himself fighting for survival as one fateful, horrifying night collapses around him in chaos.', 

'https://www.themoviedb.org/t/p/w1280/guq5cJ43v0qcMtLqrYHe5P9fgFM.jpg', 

'https://www.youtube.com/embed/SJPu1spHqfk?si=5vaxsXn9iK4ZgBqR', 

'Zach Cregger', 

'Robert Kulzer', 

'Austin Abrams, Zach Cherry, Kali Reis', 

'Coming Soon'), 

 

 

 

('Avengers: Doomsday', 

'Science-Fiction', 

'PG-13', 

'Beloved heroes from three distinct universes are set on a deadly collision course and face an existential threat unlike anything they''ve ever encountered.', 

'https://www.themoviedb.org/t/p/w1280/jzPwsojjFStf5lR5Nm07w2hH56G.jpg', 

'https://www.youtube.com/embed/irVNGjRFZGk?si=GQuawt8_1Q4NxQAq', 

'Joe Russo and Anthony Russo', 

'Kevin Feige', 

'Robert Downey Jr., Chris Evans, Pedro Pascal', 

'Coming Soon'), 

 

('Dune: Part Three', 

'Adventure', 

'PG-13', 

'Emperor Paul Atreides faces the fallout from his ascent to power as political plots and a galaxy-wide holy war endanger the future only he can see.', 

'https://www.themoviedb.org/t/p/w1280/d43fvHQsIMa4kpyhKXw0haEJIvI.jpg', 

'https://www.youtube.com/embed/3_9vCamtuPY?si=ojdAhD0kbDQC9agT', 

'Denis Villeneuve', 

'Brain Herbert', 

'Timothee Chalamet, Zendaya, Jason Momoa', 

'Coming Soon'), 

 

 

 

 

('The Angry Birds Movie 3', 

'Comedy', 

'PG', 

'Red faces his greatest challenge yet, surviving fatherhood while saving the world.', 

'https://www.themoviedb.org/t/p/w1280/oxaW6X3xohnzdFSBKCrCjRDckMe.jpg', 

'https://www.youtube.com/embed/a9DB_aUMzME?si=5l6XK7Plp7wItYwC', 

'John Rice', 

'John Cohen', 

'Jason Sudeikis, Josh Gad, Danny McBride', 

'Coming Soon'), 

 

('Jumanji: Open World', 

'Adventure', 

'PG-13', 

'Our heroes have escaped the ever-changing jungles of Jumanji before, but this time the game comes to us - as Jumanji breaks free of its console, unleashing its chaos into our world.', 

'https://www.themoviedb.org/t/p/w1280/qv0X60rC2SUWVvOkbgixpRoOSoq.jpg', 

'https://www.youtube.com/embed/zhApeaHMvfs?si=QTccbz4SzzrxtU7F', 

'Jake Kadsen', 

'Dany Garcia', 

'Dwayne Johnson, Kevin Hart, Jack Black', 

'Coming Soon'); 
