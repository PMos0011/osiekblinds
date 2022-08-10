package moscode.osiekblinds.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import moscode.osiekblinds.service.BlindDirection;

@AllArgsConstructor
@Getter
public class BlindActivationDto {
    private final BlindDirection direction;
    private final Integer id;
}
