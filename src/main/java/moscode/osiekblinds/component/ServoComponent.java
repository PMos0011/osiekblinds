package moscode.osiekblinds.component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import moscode.osiekblinds.model.dto.ServoDto;
import moscode.osiekblinds.model.dto.TempDto;
import moscode.osiekblinds.service.ServoService;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Component
@EnableScheduling
public class ServoComponent {

    private final ServoService servoService;
    private final ObjectMapper objectMapper;
    private final SimpMessagingTemplate simpMessagingTemplate;

    private static final int SERVO_COUNT = 4;
    private static final int SERVO_MAX_VAL = 100;
    private static final int SERVO_MIN_VAL = 0;

    @Getter
    private List<ServoDto> servos = new ArrayList<>();
    @Getter
    private TempDto temp = new TempDto(0, 0);

    @Scheduled(fixedDelay = 10000)
    public void getServoState() throws JsonProcessingException {
        try {
            HttpResponse<String> response = servoService.getServoState();
            if (response.statusCode() != 200)
                servos = new ArrayList<>();
            else
                servos = objectMapper.readValue(response.body(), new TypeReference<>() {
                });
        } catch (Exception e) {
            servos = new ArrayList<>();
        } finally {
            simpMessagingTemplate.convertAndSend("/servo/state", objectMapper.writeValueAsString(servos));
        }
    }

    @Scheduled(fixedDelay = 60000 * 5)
    public void getTempData() {
        try {
            HttpResponse<String> response = servoService.getTemp();
            if (response.statusCode() == 200) {
                temp = objectMapper.readValue(response.body(), TempDto.class);
                simpMessagingTemplate.convertAndSend("/temp/state", objectMapper.writeValueAsString(temp));
            }
        } catch (Exception ignore) {
        }
    }

    public void setServoState(ServoDto servo) throws JsonProcessingException {
        if (servo.getId() < 0
                || servo.getId() > SERVO_COUNT - 1
                || servo.getState() < SERVO_MIN_VAL
                || servo.getState() > SERVO_MAX_VAL) {
            simpMessagingTemplate.convertAndSend("/servo/state", objectMapper.writeValueAsString(servos));
            return;
        }

        if (!calculateSpace(servo)) {
            simpMessagingTemplate.convertAndSend("/servo/state", objectMapper.writeValueAsString(servos));
            return;
        }

        try {
            ServoDto toSend = new ServoDto(servo.getId(), 100 - servo.getState());
            HttpResponse<String> response = servoService.setServoState(toSend);
            if (response.statusCode() != 200) {
                getServoState();
                return;
            }

            getServoState();
        } catch (Exception ignore) {
        }
    }

    private boolean calculateSpace(ServoDto servo) {
        Optional<ServoDto> s = servos.stream()
                .filter(item -> item.getId().equals(servo.getId()))
                .findFirst();

        if (s.isEmpty())
            return false;

        if (s.get().getState() <= servo.getState())
            return true;

        int sum = servos.stream()
                .filter(item -> item.getId() != SERVO_COUNT - 1 && !item.getId().equals(servo.getId()))
                .map(ServoDto::getState)
                .reduce(0, Integer::sum);

        return sum + servo.getState() >= 50;
    }
}
