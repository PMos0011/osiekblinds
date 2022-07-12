package moscode.osiekblinds.configuration;

import com.pi4j.Pi4J;
import com.pi4j.context.Context;
import com.pi4j.io.gpio.digital.DigitalOutput;
import com.pi4j.io.gpio.digital.DigitalState;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class Pi4jPinConfig {

    @Bean
    public Context pi4j() {
        Context pi4j = Pi4J.newAutoContext();

        var led = DigitalOutput.newConfigBuilder(pi4j)
                .id("test-out")
                .address(16)
                .shutdown(DigitalState.LOW)
                .initial(DigitalState.LOW)
                .provider("linuxfs-digital-output");

        pi4j.create(led);
        return pi4j;
    }
}
