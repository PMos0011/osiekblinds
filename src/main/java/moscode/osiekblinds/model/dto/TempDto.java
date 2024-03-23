package moscode.osiekblinds.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class TempDto {
    private final Integer temp;
    private final Integer hum;
}
