package moscode.osiekblinds.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import moscode.osiekblinds.model.Blind;

@AllArgsConstructor
@Getter
public class BlindDto {
    final private Integer id;
    final private String blindName;
    final private Boolean global;

    public static BlindDto fromBlind(Blind blind) {
        return new BlindDto(
                blind.getId(),
                blind.getBlindName(),
                blind.getGlobal()
        );
    }
}
