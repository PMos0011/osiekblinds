package moscode.osiekblinds.service;

import com.pi4j.context.Context;
import com.pi4j.io.gpio.digital.DigitalInput;
import com.pi4j.io.gpio.digital.DigitalState;
import com.pi4j.io.gpio.digital.DigitalStateChangeEvent;
import lombok.RequiredArgsConstructor;
import moscode.osiekblinds.model.Blind;
import moscode.osiekblinds.model.DayDefinition;
import moscode.osiekblinds.model.DebugData;
import moscode.osiekblinds.model.ScheduleAction;
import moscode.osiekblinds.model.dto.BlindDto;
import moscode.osiekblinds.model.dto.BlindSateDto;
import moscode.osiekblinds.model.dto.InitDto;
import moscode.osiekblinds.repository.BlindDefinitionRepository;
import moscode.osiekblinds.repository.DayDefinitionRepository;
import moscode.osiekblinds.repository.DebugDataRepository;
import moscode.osiekblinds.repository.ScheduleActionRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.time.Instant;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.ReentrantLock;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BlindsService {

    private final int TEST_BLIND_ID = 2;

    private List<BlindSateDto> blindState;
    private DigitalState topEnabled = DigitalState.LOW;
    private DigitalState bottomEnabled = DigitalState.LOW;
    private DigitalState engineEnabled = DigitalState.LOW;
    private long tickTime;
    private long stopEngineTime;
    private final ReentrantLock stateLock = new ReentrantLock();
    private final Context pi4j;
    private final GPIOService gpioService;
    private final BlindDefinitionRepository blindDefinitionRepository;
    private final DayDefinitionRepository dayDefinitionRepository;
    private final ScheduleActionRepository scheduleActionRepository;
    private final DebugDataRepository debugDataRepository;
    private final ScheduleHandler scheduleHandler;
    private final SimpMessagingTemplate simpMessagingTemplate;


    @PostConstruct
    public void initState() {
        blindState = blindDefinitionRepository.findAll()
                .stream()
                .map(BlindSateDto::fromBlind)
                .collect(Collectors.toList());

        DigitalInput in4 = pi4j.io("input-4");
        in4.addListener(this::handleTopLed);
        DigitalInput in15 = pi4j.io("input-14");
        in15.addListener(this::handleBottomLed);
        DigitalInput in21 = pi4j.io("input-21");
        in21.addListener(this::handleEngine);
    }

    public InitDto getDefinitions() {
        return new InitDto(
                dayDefinitionRepository.findAll(),
                blindDefinitionRepository.findAll().stream().map(BlindDto::fromBlind).collect(Collectors.toList()),
                scheduleActionRepository.findAll(),
                blindState
        );
    }

    public List<Blind> getBlinds() {
        return blindDefinitionRepository.findAll();
    }

    public List<DayDefinition> getDays() {
        return dayDefinitionRepository.findAll();
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

    @Scheduled(fixedRate = 3000)
    public void updateBlindState() {
        BlindSateDto state = blindState.get(TEST_BLIND_ID);
        if (state.isInMove()) {
            calculatePosition();
            sendState(false);
        }
    }

    private void handleTopLed(DigitalStateChangeEvent event) {
        System.out.println("top triggered: " + event.state().getName());
        if (!topEnabled.equals(event.state())) {
            topEnabled = event.state();

            try {
                if (stateLock.tryLock(200, TimeUnit.MILLISECONDS)) {
                    try {
                        if (topEnabled.equals(DigitalState.HIGH) && engineEnabled.equals(DigitalState.HIGH)) {
                            startMove(BlindDirection.UP);
                        }

                        if (topEnabled.equals(DigitalState.LOW))
                            stopMove(BlindDirection.UP);


                    } finally {
                        stateLock.unlock();
                        addDebugData();
                    }
                }

            } catch (InterruptedException ie) {
                throw new RuntimeException(ie);
            }
        }
    }

    private void handleBottomLed(DigitalStateChangeEvent event) {
        System.out.println("bottom triggered: " + event.state().getName());
        if (!bottomEnabled.equals(event.state())) {
            bottomEnabled = event.state();

            try {
                if (stateLock.tryLock(200, TimeUnit.MILLISECONDS)) {
                    try {
                        if (bottomEnabled.equals(DigitalState.HIGH) && engineEnabled.equals(DigitalState.HIGH)) {
                            startMove(BlindDirection.DOWN);
                        }

                        if (bottomEnabled.equals(DigitalState.LOW))
                            stopMove(BlindDirection.DOWN);

                    } finally {
                        stateLock.unlock();
                        addDebugData();
                    }
                }

            } catch (InterruptedException ie) {
                throw new RuntimeException(ie);
            }
        }
    }

    private void handleEngine(DigitalStateChangeEvent event) {
        System.out.println("engine triggered: " + event.state().getName());
        if (!engineEnabled.equals(event.state())) {
            engineEnabled = event.state();

            try {
                if (stateLock.tryLock(200, TimeUnit.MILLISECONDS)) {
                    try {
                        if (engineEnabled.equals(DigitalState.HIGH)) {
                            if (topEnabled.equals(DigitalState.HIGH))
                                startMove(BlindDirection.UP);
                            else if (bottomEnabled.equals(DigitalState.HIGH))
                                startMove(BlindDirection.DOWN);

                        } else
                            stopMove();

                    } finally {
                        stateLock.unlock();
                        addDebugData();
                    }
                }
            } catch (InterruptedException ie) {
                throw new RuntimeException(ie);
            }
        }
    }

    private void startMove(BlindDirection direction) {
        tickTime = Instant.now().toEpochMilli();
        stopEngineTime = 0;

        BlindSateDto state = blindState.get(TEST_BLIND_ID);
        state.setInMove(true);
        state.setDirection(direction);
        calculatePosition();

        sendState(false);
    }

    private void stopMove(BlindDirection direction) {
        boolean resetPosition = false;

        if (stopEngineTime > 0)
            resetPosition = Math.abs(Instant.now().toEpochMilli() - stopEngineTime) > 200;

        BlindSateDto state = blindState.get(TEST_BLIND_ID);
        state.setInMove(false);

        if (resetPosition)
            state.setPosition(direction.equals(BlindDirection.UP) ? 0 : 100);
        else
            calculatePosition();

        stopEngineTime = 0;
        sendState(true);
    }

    private void stopMove() {
        stopEngineTime = Instant.now().toEpochMilli();

        BlindSateDto state = blindState.get(TEST_BLIND_ID);
        state.setInMove(false);
        calculatePosition();

        sendState(true);
    }

    public void sendState(boolean save) {
        simpMessagingTemplate.convertAndSend("/blinds/state", blindState);

        if (save) {
            BlindSateDto state = blindState.get(TEST_BLIND_ID);
            blindDefinitionRepository.findById(TEST_BLIND_ID).ifPresent(blind -> {
                blind.updateState(state.getDirection(), state.getPosition());
                blindDefinitionRepository.save(blind);
            });
        }
    }

    private void calculatePosition() {
        BlindSateDto state = blindState.get(TEST_BLIND_ID);
        long workPeriod = Instant.now().toEpochMilli() - tickTime;
        tickTime = Instant.now().toEpochMilli();

        // p = wp * 100 / time * 1000 (sec to millis)
        double position = (double) workPeriod / (double) (state.getMoveTime() * 10);

        double currentPosition = state.getDirection().equals(BlindDirection.UP)
                ? state.getPosition() + position
                : state.getPosition() - position;

        if (currentPosition > 100)
            currentPosition = 100;

        if (currentPosition < 0)
            currentPosition = 0;

        state.setPosition(currentPosition);
    }

    private void addDebugData() {
        BlindSateDto state = blindState.get(TEST_BLIND_ID);
        debugDataRepository.save(
                DebugData.builder()
                        .enginState(engineEnabled)
                        .topLed(topEnabled)
                        .bottomLed(bottomEnabled)
                        .position(state.getPosition())
                        .build()
        );
    }
}
