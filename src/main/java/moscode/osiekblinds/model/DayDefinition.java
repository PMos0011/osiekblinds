package moscode.osiekblinds.model;

import lombok.Getter;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;

@Entity
@Getter
@Table(name = "day_definitions")
public class DayDefinition implements Serializable {
    @Id
    private Integer id;
    private String shortName;
    private String dayName;
}
