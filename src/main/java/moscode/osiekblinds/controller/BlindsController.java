package moscode.osiekblinds.controller;

import lombok.RequiredArgsConstructor;
import moscode.osiekblinds.service.BlindDirection;
import moscode.osiekblinds.service.BlindsService;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@EnableAsync
public class BlindsController {

    final private BlindsService blindsService;

    @PostMapping("/{direction}/{id}")
    public void activateRelay(@PathVariable BlindDirection direction, @PathVariable Integer id) {
        blindsService.activateRelay(id, direction);
    }

    @GetMapping("/off")
    public void turnOff() {
        blindsService.turnOff();
    }
}
