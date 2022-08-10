package moscode.osiekblinds.service;

import com.pi4j.context.Context;
import com.pi4j.io.gpio.digital.DigitalOutput;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.ReentrantLock;


@Service
@RequiredArgsConstructor
public class GPIOService {

    private final static int PULSE_TIME = 500;
    private final static String RELAY_ID = "rel-%s-%d";
    private final Context pi4j;
    private final Map<Integer, ReentrantLock> mutexMap;

    @Async
    public void activate(int relayNumber, BlindDirection direction) {
        String relId = String.format(RELAY_ID, direction.getCode(), relayNumber);
        ReentrantLock mutex = mutexMap.get(relayNumber);

        DigitalOutput out = pi4j.io(relId);

        try {
            if (mutex.tryLock(PULSE_TIME + 200, TimeUnit.MILLISECONDS)) {
                try {
                    out.pulse(PULSE_TIME, TimeUnit.MILLISECONDS);
                } finally {
                    mutex.unlock();
                }
            } else
                throw new RuntimeException("Relay lock error");
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }
}
