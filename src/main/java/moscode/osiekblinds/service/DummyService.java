package moscode.osiekblinds.service;

import com.pi4j.context.Context;
import com.pi4j.io.gpio.digital.DigitalOutput;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DummyService {

    private final Context pi4j;

    public void turnOn() {
        DigitalOutput out = pi4j.io("test-out");
        out.high();
    }

    public void turnOff() {
        DigitalOutput out = pi4j.io("test-out");
        out.low();
    }
}
