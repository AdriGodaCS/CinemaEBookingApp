package com.cinemaebooking.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.jdbc.autoconfigure.DataSourceAutoConfiguration;

import io.github.cdimascio.dotenv.Dotenv;

// Main Spring Boot application class
@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
public class BackendApplication {

    // Load environment settings and start the application
	public static void main(String[] args) {

		 // Load .env and copy to System properties so Spring can see them
        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
        dotenv.entries().forEach(entry -> 
            System.setProperty(entry.getKey(), entry.getValue())
        );
		
		SpringApplication.run(BackendApplication.class, args);
	}

}
