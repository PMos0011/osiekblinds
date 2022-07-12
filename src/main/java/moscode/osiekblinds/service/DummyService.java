package moscode.osiekblinds.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DummyService {

    public String getSomeData() {
        return "Hello";
    }
}
