package moscode.osiekblinds.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import moscode.osiekblinds.component.ServoComponent;
import moscode.osiekblinds.model.ScheduleAction;
import moscode.osiekblinds.model.dto.BlindActivationDto;
import moscode.osiekblinds.model.dto.InitDto;
import moscode.osiekblinds.model.dto.ServoDto;
import moscode.osiekblinds.model.dto.TempDto;
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
    private final ServoComponent servoComponent;


    @MessageMapping("/init")
    @SendTo("/init/res")
    public InitDto testSub() {
        return blindsService.getDefinitions();
    }

    @MessageMapping("/servo")
    @SendTo("/servo/state")
    public List<ServoDto> initServo() {
        return servoComponent.getServos();
    }

    @MessageMapping("/temp")
    @SendTo("/temp/state")
    public TempDto initTemp() {
        return servoComponent.getTemp();
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

    @MessageMapping("/servo/set")
    public void setServoState(@Payload ServoDto servo) throws JsonProcessingException {
        servoComponent.setServoState(servo);
    }
}
