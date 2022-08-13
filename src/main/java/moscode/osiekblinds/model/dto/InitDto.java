package moscode.osiekblinds.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import moscode.osiekblinds.model.DayDefinition;
import moscode.osiekblinds.model.ScheduleAction;

import java.util.List;

@AllArgsConstructor
@Getter
public class InitDto {

    private final List<DayDefinition> days;
    private final List<BlindDto> blinds;
    private final List<ScheduleAction> actions;
}
