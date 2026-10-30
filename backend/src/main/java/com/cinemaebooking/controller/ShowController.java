package com.cinemaebooking.controller;

import com.cinemaebooking.model.show.CreateShowRequest;
import com.cinemaebooking.model.show.Show;
import com.cinemaebooking.service.ShowService;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;

import java.util.Optional;


@RestController 
@RequestMapping("/shows")
@CrossOrigin(origins = "*")
public class ShowController {

    private final ShowService showService;

    public ShowController(ShowService showService) {
        this.showService = showService;
    }

    /****** GET ******/

    @GetMapping("/{id}")
    public Optional<Show> getShowById(@RequestParam Integer id) {
        return showService.getById(id);
    }

    /****** POST ******/

    @PostMapping
    public ResponseEntity<?> createShow(
        @RequestBody CreateShowRequest showRequest
    ) {
        try {
            Show createdShow = showService.createShow(showRequest);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(createdShow);
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(
                        java.util.Map.of(
                            "message", e.getMessage()
                    ));
        }
        
    }

    /****** PUT ******/
    
    /****** DELETE ******/
}
