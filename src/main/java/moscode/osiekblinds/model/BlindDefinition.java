package moscode.osiekblinds.model;

import lombok.Getter;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;

@Entity
@Getter
@Table(name = "blinds_definitions")
public class BlindDefinition implements Serializable {
    @Id
    private Integer id;
    private String blindName;
    private Boolean global;
}
