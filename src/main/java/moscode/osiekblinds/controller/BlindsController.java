package moscode.osiekblinds.controller;

import lombok.RequiredArgsConstructor;
import moscode.osiekblinds.model.BlindDefinition;
import moscode.osiekblinds.model.DayDefinition;
import moscode.osiekblinds.model.ScheduleAction;
import moscode.osiekblinds.service.BlindDirection;
import moscode.osiekblinds.service.BlindsService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class BlindsController {

    final private BlindsService blindsService;

    @GetMapping("/blinds")
    public List<BlindDefinition> getBlinds() {
        return blindsService.getBlinds();
    }

    @GetMapping("/days")
    public List<DayDefinition> getDays() {
        return blindsService.getDays();
    }

    @GetMapping("/schedules")
    public List<ScheduleAction> getSchedules() {
        return blindsService.getScheduled();
    }

    @PostMapping("/add")
    public List<ScheduleAction> addAction(@RequestBody ScheduleAction action) {
        return blindsService.addAction(action);
    }

    @DeleteMapping("/delete/{id}")
    public List<ScheduleAction> deleteAction(@PathVariable long id) {
        return blindsService.deleteSchedule(id);
    }

    @PutMapping("/toggle/{id}")
    public List<ScheduleAction> toggleAction(@PathVariable long id) {
        return blindsService.toggleSchedule(id);
    }

    @PostMapping("/{direction}/{id}")
    public void activateRelay(@PathVariable BlindDirection direction, @PathVariable Integer id) {
        blindsService.activateRelay(id, direction);
    }
}
