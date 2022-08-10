package moscode.osiekblinds.service;

import com.pi4j.context.Context;
import com.pi4j.io.gpio.digital.DigitalOutput;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;


//@Service
@RequiredArgsConstructor
public class GPIOService {

    private final static String RELAY_ID = "rel-%s-%d";
    private final Context pi4j;

    @Async
    public void activate(int relayNumber, BlindDirection direction) {
        String relId = String.format(RELAY_ID, direction.getCode(), relayNumber);

        DigitalOutput out = pi4j.io(relId);
        out.blink(500, TimeUnit.MILLISECONDS);

    }
}
