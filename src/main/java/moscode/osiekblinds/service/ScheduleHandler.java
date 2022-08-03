package moscode.osiekblinds.service;

import lombok.RequiredArgsConstructor;
import moscode.osiekblinds.component.ScheduleTaskDefinition;
import moscode.osiekblinds.model.ScheduleAction;
import moscode.osiekblinds.repository.ScheduleActionRepository;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.support.CronTrigger;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.TimeZone;
import java.util.concurrent.ScheduledFuture;

@Service
@RequiredArgsConstructor
public class ScheduleHandler {

    private final static String ID_PATTERN = "%d_%s";
    private final TaskScheduler taskScheduler;
    private final GPIOService gpioService;
    private final ScheduleActionRepository scheduleActionRepository;
    private final Map<String, ScheduledFuture<?>> jobs = new HashMap<>();

    @PostConstruct
    public void loadSchedules() {
        scheduleActionRepository.findAll()
                .stream()
                .filter(ScheduleAction::isActive)
                .forEach(this::addJob);
    }

    public void addJob(ScheduleAction action) {
        Arrays.stream(BlindDirection.values()).forEach(direction -> {
            ScheduleTaskDefinition taskAction = ScheduleTaskDefinition.fromScheduledAction(action, direction, gpioService);
            String jobId = resolveId(taskAction.getId(), direction);

            if (jobs.containsKey(jobId))
                removeJob(taskAction.getId());

            jobs.put(jobId,
                    taskScheduler.schedule(taskAction, new CronTrigger(taskAction.getCronExpression(), TimeZone.getTimeZone(TimeZone.getDefault().getID()))));
        });
    }

    public void removeJob(long id) {
        Arrays.stream(BlindDirection.values()).forEach(direction -> {
            String jobId = resolveId(id, direction);
            jobs.get(jobId).cancel(false);
            jobs.remove(jobId);
        });
    }

    private String resolveId(long id, BlindDirection direction) {
        return String.format(ID_PATTERN, id, direction.getCode());
    }
}
