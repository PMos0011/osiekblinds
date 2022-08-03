package moscode.osiekblinds.service;

import lombok.RequiredArgsConstructor;
import moscode.osiekblinds.model.BlindDefinition;
import moscode.osiekblinds.model.DayDefinition;
import moscode.osiekblinds.model.ScheduleAction;
import moscode.osiekblinds.repository.BlindDefinitionRepository;
import moscode.osiekblinds.repository.DayDefinitionRepository;
import moscode.osiekblinds.repository.ScheduleActionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BlindsService {
    private final GPIOService gpioService;
    private final BlindDefinitionRepository blindDefinitionRepository;
    private final DayDefinitionRepository dayDefinitionRepository;
    private final ScheduleActionRepository scheduleActionRepository;
    private final ScheduleHandler scheduleHandler;

    public List<BlindDefinition> getBlinds() {
        return blindDefinitionRepository.findAll();
    }

    public List<DayDefinition> getDays() {
        return dayDefinitionRepository.findAll();
    }

    public List<ScheduleAction> getScheduled() {
        return scheduleActionRepository.findAll();
    }

    public List<ScheduleAction> deleteSchedule(long id) {
        scheduleActionRepository.findById(id).ifPresent(action -> {
            scheduleActionRepository.delete(action);

            if (action.isActive())
                scheduleHandler.removeJob(action.getId());
        });

        return scheduleActionRepository.findAll();
    }

    public List<ScheduleAction> toggleSchedule(long id) {
        scheduleActionRepository.findById(id).ifPresent(action -> {
            action.toggleActivity();
            ScheduleAction saved = scheduleActionRepository.save(action);

            if (saved.isActive())
                scheduleHandler.addJob(saved);
            else
                scheduleHandler.removeJob(saved.getId());
        });

        return scheduleActionRepository.findAll();
    }

    public List<ScheduleAction> addAction(ScheduleAction action) {
        scheduleHandler.addJob(scheduleActionRepository.save(action));
        return scheduleActionRepository.findAll();
    }

    public void activateRelay(int relayNumber, BlindDirection direction) {
        gpioService.activate(relayNumber, direction);
    }
}
