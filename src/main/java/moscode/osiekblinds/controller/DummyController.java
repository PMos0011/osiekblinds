package moscode.osiekblinds.controller;

import lombok.RequiredArgsConstructor;
import moscode.osiekblinds.service.DummyService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("dummy-test")
public class DummyController {

    final private DummyService dummyService;

    @GetMapping
    public String getDummyData() {
        return dummyService.getSomeData();
    }
}
