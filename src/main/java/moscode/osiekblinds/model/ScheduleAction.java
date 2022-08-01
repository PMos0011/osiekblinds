package moscode.osiekblinds.model;

import lombok.Getter;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Entity
@Table(name = "schedule_actions")
public class ScheduleAction implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String planName;
    private Timestamp up;
    private Timestamp down;
    private boolean active;

    @OneToMany
    @JoinTable(
            name = "blind_schedule",
            joinColumns = @JoinColumn(name = "schedule_id"),
            inverseJoinColumns = @JoinColumn(name = "blind_id")
    )
    private List<BlindDefinition> blinds;

    @OneToMany
    @JoinTable(
            name = "day_schedule",
            joinColumns = @JoinColumn(name = "schedule_id"),
            inverseJoinColumns = @JoinColumn(name = "day_id")
    )
    private List<DayDefinition> days;

    public void toggleActivity() {
        active = !active;
    }
}
