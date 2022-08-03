package moscode.osiekblinds.service;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class GPIOFake {
    private final static String RELAY_ID = "rel-%s-%d";

    @Async
    public void activate(int relayNumber, BlindDirection direction) {
        String relId = String.format(RELAY_ID, direction.getCode(), relayNumber);
        String opposedRelId = String.format(RELAY_ID,
                direction.equals(BlindDirection.UP) ? BlindDirection.DOWN.getCode() : BlindDirection.UP.getCode(),
                relayNumber);

        System.out.println(relId + " : " + opposedRelId);
        System.out.println(relId + " ON");
        sleep(1000);
        System.out.println(relId + " OFF");
    }

    private void sleep(int millis) {
        try {
            Thread.sleep(millis);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

}
