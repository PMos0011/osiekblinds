package moscode.osiekblinds.service;

import com.pi4j.context.Context;
import com.pi4j.io.gpio.digital.DigitalOutput;
import lombok.RequiredArgsConstructor;
import moscode.osiekblinds.model.BlindDefinition;
import moscode.osiekblinds.model.DayDefinition;
import moscode.osiekblinds.model.ScheduleAction;
import moscode.osiekblinds.repository.BlindDefinitionRepository;
import moscode.osiekblinds.repository.DayDefinitionRepository;
import moscode.osiekblinds.repository.ScheduleActionRepository;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BlindsService {
    //    private final Context pi4j;
    private final static String RELAY_ID = "rel-%s-%d";
    private final BlindDefinitionRepository blindDefinitionRepository;
    private final DayDefinitionRepository dayDefinitionRepository;
    private final ScheduleActionRepository scheduleActionRepository;

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
        scheduleActionRepository.deleteById(id);
        return scheduleActionRepository.findAll();
    }

    public List<ScheduleAction> toggleSchedule(long id) {
        return scheduleActionRepository.findById(id).map(action -> {
            action.toggleActivity();
            scheduleActionRepository.save(action);
            return scheduleActionRepository.findAll();
        }).orElseGet(ArrayList::new);
    }

    public List<ScheduleAction> addAction(ScheduleAction action) {
        scheduleActionRepository.save(action);
        return scheduleActionRepository.findAll();
    }

    public List<ScheduleAction> editAction(ScheduleAction action) {
        scheduleActionRepository.save(action);
        return scheduleActionRepository.findAll();
    }

    @Async
    public void activateRelay(int relayNumber, BlindDirection direction) {
        String relId = String.format(RELAY_ID, direction.getCode(), relayNumber);
//        DigitalOutput out = pi4j.io(relId);
//        out.high();
//        turnOff(out);
    }
}
