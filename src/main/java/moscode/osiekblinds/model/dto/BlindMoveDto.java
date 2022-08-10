package moscode.osiekblinds.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import moscode.osiekblinds.service.BlindDirection;

@AllArgsConstructor
@Getter
public class BlindMoveDto {
    private long id;
    private BlindDirection direction;
}
