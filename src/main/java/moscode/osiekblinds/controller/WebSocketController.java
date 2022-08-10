package moscode.osiekblinds.controller;

import lombok.RequiredArgsConstructor;
import moscode.osiekblinds.model.ScheduleAction;
import moscode.osiekblinds.model.dto.BlindActivationDto;
import moscode.osiekblinds.model.dto.InitDto;
import moscode.osiekblinds.service.BlindsService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class WebSocketController {

    private final BlindsService blindsService;


    @MessageMapping("/init")
    @SendTo("/init/res")
    public InitDto testSub() {
        return blindsService.getDefinitions();
    }

    @MessageMapping("/delete")
    @SendTo("/schedules")
    public List<ScheduleAction> deleteAction(@Payload Long id) {
        return blindsService.deleteSchedule(id);
    }

    @MessageMapping("/toggle")
    @SendTo("/schedules")
    public List<ScheduleAction> toggleAction(@Payload Long id) {
        return blindsService.toggleSchedule(id);
    }

    @MessageMapping("/add")
    @SendTo("/schedules")
    public List<ScheduleAction> toggleAction(@Payload ScheduleAction action) {
        return blindsService.addAction(action);
    }

    @MessageMapping("/blinds")
    public void blindsSate(@Payload BlindActivationDto action) {
        blindsService.activateRelay(action.getId(), action.getDirection());
    }
}
