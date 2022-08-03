package moscode.osiekblinds.service;

import com.pi4j.context.Context;
import com.pi4j.io.gpio.digital.DigitalOutput;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class GPIOService {

    private final static String RELAY_ID = "rel-%s-%d";
    private final Context pi4j;

    @Async
    public void activate(int relayNumber, BlindDirection direction) {
        String relId = String.format(RELAY_ID, direction.getCode(), relayNumber);
        String opposedRelId = String.format(RELAY_ID,
                direction.equals(BlindDirection.UP) ? BlindDirection.DOWN.getCode() : BlindDirection.UP.getCode(),
                relayNumber);

        DigitalOutput out = pi4j.io(relId);
        DigitalOutput opposed = pi4j.io(opposedRelId);

        long timestamp = System.currentTimeMillis() + 3000;
        while (opposed.isHigh() && timestamp > System.currentTimeMillis()) {
            sleep(100);
        }

        if (timestamp >= System.currentTimeMillis()) {
            out.high();
            sleep(500);
            out.low();
        }
    }

    private void sleep(int millis) {
        try {
            Thread.sleep(millis);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }
}
