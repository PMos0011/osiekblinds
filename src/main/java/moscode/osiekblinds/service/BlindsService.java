package moscode.osiekblinds.service;

import com.pi4j.context.Context;
import com.pi4j.io.gpio.digital.DigitalOutput;
import lombok.RequiredArgsConstructor;
import moscode.osiekblinds.configuration.Pi4jPinConfig;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BlindsService {
    private final Context pi4j;
    private final String RELAY_ID = "rel-%s-%d";

    public void activateRelay(int relayNumber, BlindDirection direction) {
        String relId = String.format(RELAY_ID, direction.getCode(), relayNumber);
        DigitalOutput out = pi4j.io(relId);
        out.high();
        turnOff(out);
    }

    @Async
    public void turnOff(DigitalOutput out) {
        try {
            Thread.sleep(5000);
        } catch (InterruptedException ignore) {
        } finally {
            out.low();
        }
    }

    public void turnOn() {
        Pi4jPinConfig.outputs.forEach((relId, ignore) -> {
            DigitalOutput out = pi4j.io(relId);
            try {
                out.high();
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            } finally {
                out.low();
            }
        });
    }

    public void turnOff() {
        DigitalOutput out = pi4j.io("rel-power");
        out.toggle();
        System.out.println(out.state());

    }
}
