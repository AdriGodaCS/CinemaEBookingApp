package com.cinemaebooking.service;

import com.cinemaebooking.model.show.Show;
import com.cinemaebooking.model.show.CreateShowRequest;
import com.cinemaebooking.repository.ShowRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
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

    public List<Show> getByMovieId(Integer movieId) {
        return showRepository.findByMovieId(movieId);
    }

    public List<Show> getByShowroomId(Integer showroomId) {
        return showRepository.findByShowroomId(showroomId);
    }

    public List<String> getAvailableTimeslots(
            String showDate,
            Integer showroomId) {

        List<String> allTimeslots = List.of(
                "09:00",
                "12:00",
                "15:00",
                "18:00",
                "21:00");

        List<Show> existingShows = showRepository.findByShowDateAndShowroomId(
                showDate,
                showroomId);

        List<String> usedTimes = existingShows.stream()
                .map(Show::getShowTime)
                .toList();

        return allTimeslots.stream()
                .filter(time -> !usedTimes.contains(time))
                .toList();
    }

    public Show createShow(CreateShowRequest showRequest) {

        boolean alreadyExists = showRepository
                .findByShowDateAndShowroomId(
                        showRequest.showDate(),
                        showRequest.showroomId())
                .stream()
                .anyMatch(show -> show.getShowTime()
                        .equals(
                                showRequest.showTime()));

        if (alreadyExists) {
            throw new IllegalArgumentException(
                    "That timeslot is already booked.");
        }

        LocalDate showDate = LocalDate.parse(
                showRequest.showDate());

        LocalDate today = LocalDate.now();

        if (showDate.isBefore(today)) {
            throw new IllegalArgumentException(
                    "Show date cannot be in the past.");
        }

        if (showDate.equals(today)) {

            LocalTime showTime = LocalTime.parse(
                    showRequest.showTime());

            LocalTime now = LocalTime.now();

            if (!showTime.isAfter(now)) {

                throw new IllegalArgumentException(
                        "Show time must be in the future.");
            }
        }

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
                || createdShow.getShowTime() == null) {
            throw new IllegalArgumentException("All required fields must be filled.");
        }

        // check if show exists
        if (showRepository.existsById(createdShow.getId())) {
            throw new IllegalArgumentException("Show with this id already exists");
        }
        if (showRepository.existsByShowroomIdAndShowDateAndShowTime(
                createdShow.getShowroomId(),
                createdShow.getShowDate(),
                createdShow.getShowTime())) {
            throw new IllegalArgumentException("Cannot schedule two shows at the same place and time");
        }

        return showRepository.save(createdShow);
    }

}
