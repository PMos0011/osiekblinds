package moscode.osiekblinds.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import moscode.osiekblinds.model.dto.ServoDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

@Service
@RequiredArgsConstructor
public class ServoService {
    @Value("${servo.url}")
    private String urlString;
    @Value("${servo.auth}")
    private String authValue;

    private final ObjectMapper objectMapper;

    public HttpResponse<String> getServoState() throws IOException, InterruptedException {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .setHeader("Authorization", authValue)
                .timeout(Duration.ofSeconds(3))
                .GET()
                .uri(URI.create(urlString + "servo"))
                .build();

        return client.send(request, HttpResponse.BodyHandlers.ofString());
    }

    public HttpResponse<String> getTemp() throws IOException, InterruptedException {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .setHeader("Authorization", authValue)
                .timeout(Duration.ofSeconds(3))
                .GET()
                .uri(URI.create(urlString + "temp"))
                .build();

        return client.send(request, HttpResponse.BodyHandlers.ofString());
    }

    public HttpResponse<String> setServoState(ServoDto servo) throws IOException, InterruptedException {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .setHeader("Authorization", authValue)
                .timeout(Duration.ofSeconds(3))
                .PUT(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(servo)))
                .uri(URI.create(urlString + "servo"))
                .build();

        return client.send(request, HttpResponse.BodyHandlers.ofString());
    }
}
