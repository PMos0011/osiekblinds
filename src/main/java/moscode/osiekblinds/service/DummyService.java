package moscode.osiekblinds.service;

import com.pi4j.context.Context;
import com.pi4j.io.gpio.digital.DigitalOutput;
import lombok.RequiredArgsConstructor;
import moscode.osiekblinds.configuration.Pi4jPinConfig;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DummyService {

    private final Context pi4j;

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
        Pi4jPinConfig.outputs.forEach((relId, ignore) -> {
            DigitalOutput out = pi4j.io(relId);
            out.low();
        });
    }
}
