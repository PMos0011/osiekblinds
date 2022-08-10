package moscode.osiekblinds.model;

import lombok.Getter;
import moscode.osiekblinds.service.BlindDirection;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Getter
@Table(name = "blinds_definitions")
public class Blind implements Serializable {
    @Id
    private Integer id;
    private String blindName;
    @Enumerated(EnumType.STRING)
    private BlindDirection direction;
    private Integer moveTime;
    private Double position;
    private Boolean global;
}
