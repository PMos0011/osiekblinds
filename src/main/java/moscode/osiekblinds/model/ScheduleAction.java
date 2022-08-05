package moscode.osiekblinds.model;

import lombok.Getter;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Set;

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

    @OneToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "blind_schedule",
            joinColumns = @JoinColumn(name = "schedule_id"),
            inverseJoinColumns = @JoinColumn(name = "blind_id")
    )
    private Set<BlindDefinition> blinds;

    @OneToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "day_schedule",
            joinColumns = @JoinColumn(name = "schedule_id"),
            inverseJoinColumns = @JoinColumn(name = "day_id")
    )
    private Set<DayDefinition> days;

    public void toggleActivity() {
        active = !active;
    }
}
