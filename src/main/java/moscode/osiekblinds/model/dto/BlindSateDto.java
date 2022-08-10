package moscode.osiekblinds.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import moscode.osiekblinds.model.Blind;
import moscode.osiekblinds.service.BlindDirection;

@AllArgsConstructor
@Getter
public class BlindSateDto {
    private final long id;
    private final BlindDirection direction;
    private final double position;
    private final boolean inMove;

    public static BlindSateDto fromBlind(Blind blind) {
        return new BlindSateDto(
                blind.getId(),
                blind.getDirection(),
                blind.getPosition(),
                false
        );
    }
}
