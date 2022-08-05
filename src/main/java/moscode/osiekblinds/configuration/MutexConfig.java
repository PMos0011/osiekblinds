package moscode.osiekblinds.configuration;

import lombok.RequiredArgsConstructor;
import moscode.osiekblinds.repository.BlindDefinitionRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;
import java.util.concurrent.locks.ReentrantLock;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Configuration
@RequiredArgsConstructor
public class MutexConfig {

    private final BlindDefinitionRepository blindDefinitionRepository;

    @Bean
    public Map<Integer, ReentrantLock> mutexMap() {

        return IntStream.range(0, blindDefinitionRepository.findAll().size())
                .boxed()
                .collect(Collectors.toMap(Function.identity(), i -> new ReentrantLock()));
    }
}
