package moscode.osiekblinds.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import moscode.osiekblinds.model.Blind;
import moscode.osiekblinds.service.BlindDirection;

@AllArgsConstructor
@Getter
@Setter
public class BlindSateDto {
    private final long id;
    private BlindDirection direction;
    private double position;
    private boolean inMove;
    private int moveTime;

    public static BlindSateDto fromBlind(Blind blind) {
        return new BlindSateDto(
                blind.getId(),
                blind.getDirection(),
                blind.getPosition(),
                false,
                blind.getMoveTime()
        );
    }
}
