package com.cinemaebooking.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.cinemaebooking.model.show.Show;
import com.cinemaebooking.model.user.User;

import java.util.List;
import java.util.Optional;

@Repository 
public interface ShowRepository extends MongoRepository<Show, Integer> {

    List<Show> findByMovieId(Integer movieId);

    List<Show> findByShowroomId(Integer showroomId);

    List<Show> findByStatus(String status);

    List<Show> findByShowDate(String showDate);

    Optional<Show> findTopByOrderByIdDesc();

    Boolean existsByMovieId(Integer movieId);

    Boolean existsByShowroomId(Integer showroomId);

    Boolean existsByShowDate(String showDate);

    Boolean existsByShowroomIdAndShowDateAndShowTime(Integer showroomId, String showDate, String showTime);
}
