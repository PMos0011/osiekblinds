package moscode.osiekblinds.model;

import com.pi4j.io.gpio.digital.DigitalState;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;

@Getter
@Entity
@Table(name = "blind_move_data")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DebugData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Enumerated(EnumType.STRING)
    private DigitalState enginState;
    @Enumerated(EnumType.STRING)
    private DigitalState topLed;
    @Enumerated(EnumType.STRING)
    private DigitalState bottomLed;
    private Double position;
    @CreationTimestamp
    private LocalDateTime actionTime;

}
