package moscode.osiekblinds.service;

import com.pi4j.context.Context;
import com.pi4j.io.gpio.digital.DigitalOutput;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BlindsService {
    private final Context pi4j;
    private final static String RELAY_ID = "rel-%s-%d";

    @Async
    public void activateRelay(int relayNumber, BlindDirection direction) {
        String relId = String.format(RELAY_ID, direction.getCode(), relayNumber);
        DigitalOutput out = pi4j.io(relId);
        out.high();
        turnOff(out);
    }

    public void turnOff(DigitalOutput out) {
        try {
            Thread.sleep(700);
        } catch (InterruptedException ignore) {
        } finally {
            out.low();
        }
    }
}
