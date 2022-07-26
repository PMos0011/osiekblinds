package moscode.osiekblinds.configuration;

import com.pi4j.Pi4J;
import com.pi4j.context.Context;
import com.pi4j.io.gpio.digital.DigitalOutput;
import com.pi4j.io.gpio.digital.DigitalState;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

@Configuration
public class Pi4jPinConfig {

    public final static Map<String, Integer> outputs = Map.ofEntries(
            Map.entry("rel-u-0", 17),
            Map.entry("rel-d-0", 18),
            Map.entry("rel-u-1", 22),
            Map.entry("rel-d-1", 24),
            Map.entry("rel-u-2", 19),
            Map.entry("rel-d-2", 9),
            Map.entry("rel-u-3", 25),
            Map.entry("rel-d-3", 11),
            Map.entry("rel-u-4", 8),
            Map.entry("rel-d-4", 7),
            Map.entry("rel-u-5", 6),
            Map.entry("rel-d-5", 12),
            Map.entry("rel-u-6", 13),
            Map.entry("rel-d-6", 19),
            Map.entry("rel-u-7", 16),
            Map.entry("rel-d-7", 26),
            Map.entry("rel-u-8", 20),
            Map.entry("rel-d-8", 21)
    );

    @Bean
    public Context pi4j() {
        Context pi4j = Pi4J.newAutoContext();

        var config = DigitalOutput.newConfigBuilder(pi4j)
                .provider("pigpio-digital-output")
                .shutdown(DigitalState.LOW)
                .initial(DigitalState.LOW);

        outputs.forEach((relId, pin) -> pi4j.create(config.address(pin).id(relId)));

        pi4j.create(DigitalOutput.newConfigBuilder(pi4j)
                .provider("pigpio-digital-output")
                .shutdown(DigitalState.LOW)
                .initial(DigitalState.HIGH)
                .address(4)
                .id("rel-power"));

        return pi4j;
    }
}
