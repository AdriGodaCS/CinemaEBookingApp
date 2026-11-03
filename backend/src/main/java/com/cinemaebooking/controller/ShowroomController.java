package com.cinemaebooking.controller;

import com.cinemaebooking.model.showroom.Showroom;
import com.cinemaebooking.service.ShowroomService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/showrooms")
@CrossOrigin(origins = "*")
public class ShowroomController {

    private final ShowroomService showroomService;

    public ShowroomController(ShowroomService showroomService) {
        this.showroomService = showroomService;
    }

    /****** GET ******/

    // Get all showrooms
    @GetMapping
    public List<Showroom> getAllShowrooms() {
        return showroomService.getAllShowrooms();
    }

    // Get a showroom by id
    @GetMapping("/{id}")
    public Optional<Showroom> getShowroomById(@PathVariable Integer id) {
        return showroomService.getShowroomById(id);
    }

    // Get a showroom by name
    @GetMapping("/name/{name}")
    public ResponseEntity<Showroom> getShowroomByName(@PathVariable String name) {
        Optional<Showroom> showroom = showroomService.getShowroomByName(name);
        return showroom.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get showrooms by seat count
    @GetMapping("/seats/{seatCount}")
    public List<Showroom> getShowroomsBySeatCount(@PathVariable Integer seatCount) {
        return showroomService.getShowroomsBySeatCount(seatCount);
    }
}