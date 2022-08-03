package moscode.osiekblinds.component;

import lombok.AllArgsConstructor;
import lombok.Getter;
import moscode.osiekblinds.model.BlindDefinition;
import moscode.osiekblinds.model.ScheduleAction;
import moscode.osiekblinds.service.BlindDirection;
import moscode.osiekblinds.service.GPIOService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@AllArgsConstructor
public class ScheduleTaskDefinition implements Runnable {
    private final static String CRON_PATTERN = "0 %d %d * * %s";

    private final String cronExpression;
    private final BlindDirection direction;
    private final long id;
    private final List<Integer> blindIds;
    private final GPIOService gpioService;

    public static ScheduleTaskDefinition fromScheduledAction(ScheduleAction action, BlindDirection direction, GPIOService gpioService) {
        LocalDateTime executionTime = direction.equals(BlindDirection.UP) ? action.getUp().toLocalDateTime() : action.getDown().toLocalDateTime();
        String days = action.getDays().stream().map(day -> day.getId().toString()).collect(Collectors.joining(","));

        return new ScheduleTaskDefinition(
                String.format(CRON_PATTERN, executionTime.getMinute(), executionTime.getHour(), days),
                direction,
                action.getId(),
                action.getBlinds().stream().map(BlindDefinition::getId).collect(Collectors.toList()),
                gpioService
        );
    }

    @Override
    public void run() {
        blindIds.forEach(blind -> gpioService.activate(blind, direction));
    }
}
