package com.cinemaebooking.service;

import com.cinemaebooking.model.show.Show;
import com.cinemaebooking.model.show.CreateShowRequest;
import com.cinemaebooking.repository.MovieRepository;
import com.cinemaebooking.repository.ShowRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ShowService {

    private final ShowRepository showRepository;

    public ShowService(ShowRepository showRepository) {
        this.showRepository = showRepository;
    }

    public Optional<Show> getById(Integer id) {
        return showRepository.findById(id);
    }

    public List<Show> findByMovieId(Integer movieId) {
        return showRepository.findByMovieId(movieId);
    }

    public List<Show> findByShowroomId(Integer showroomId) {
        return showRepository.findByShowroomId(showroomId);
    }

    public Show createShow(CreateShowRequest showRequest) {
        // new show object
        Show createdShow = new Show();

        // Get next id slot
        Integer nextId = showRepository.findTopByOrderByIdDesc()
                    .map(existingShow -> existingShow.getId() + 1)
                    .orElse(1);

        // fill show object with showRequest info
        createdShow.setId(nextId);
        createdShow.setMovieId(showRequest.movieId());
        createdShow.setShowroomId(showRequest.showroomId());
        createdShow.setShowDate(showRequest.showDate());
        createdShow.setShowTime(showRequest.showTime());
        createdShow.setDurationMinutes(showRequest.durationMinutes());
        createdShow.setStatus(showRequest.status());

        // check if required fields are filled (not null)
        if (createdShow.getMovieId() == null
            || createdShow.getShowroomId() == null
            || createdShow.getShowDate() == null
            || createdShow.getShowTime() == null
            || createdShow.getDurationMinutes() == null
            || createdShow.getStatus() == null
        ) {
            throw new IllegalArgumentException("All required fields must be filled.");
        }

        // check if show exists
        if (showRepository.existsById(createdShow.getId())) {
            throw new IllegalArgumentException("Show with this id already exists");
        }
        if (showRepository.existsByShowroomIdAndShowDateAndShowTime(
                createdShow.getShowroomId(), 
                createdShow.getShowDate(), 
                createdShow.getShowTime())
        ) {
            throw new IllegalArgumentException("Cannot schedule two shows at the same place and time");
        }

        return showRepository.save(createdShow);
    }
    
}
