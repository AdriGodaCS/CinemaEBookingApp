package com.cinemaebooking.backend;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@EnableMongoRepositories(basePackages = "com.cinemaebooking.repository")
@SpringBootApplication(scanBasePackages = "com.cinemaebooking")
public class BackendApplication {

    private static String mongoUri;

    public static void main(String[] args) {

        Dotenv dotenv = Dotenv.configure()
                .directory("./")
                .ignoreIfMissing()
                .load();

        mongoUri = dotenv.get("MONGODB_URI");

        if (mongoUri == null || mongoUri.isBlank()) {
            throw new RuntimeException("MONGODB_URI was not found in .env");
        }

        System.out.println("MONGODB_URI loaded: true");

        SpringApplication.run(BackendApplication.class, args);
    }

    @Bean
    public MongoClient mongoClient() {
        return MongoClients.create(mongoUri);
    }

    @Bean
    public MongoTemplate mongoTemplate(MongoClient mongoClient) {
        return new MongoTemplate(mongoClient, "cinemaSystem");
    }
}