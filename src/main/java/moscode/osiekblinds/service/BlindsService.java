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
import javax.transaction.Transactional;
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
    private long enginStartTime = 0;
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
        DigitalInput in15 = pi4j.io("input-15");
        in4.addListener(this::handleBottomLed);
        DigitalInput in21 = pi4j.io("input-21");
        in4.addListener(this::handleEngine);
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
        if (event.source().id().equals("input-4")) {
            System.out.println("top triggered: " + event.state().getName());
            if (!topEnabled.equals(event.state())) {
                topEnabled = event.state();

                try {
                    if (stateLock.tryLock(200, TimeUnit.MILLISECONDS)) {
                        try {
                            if (topEnabled.equals(DigitalState.HIGH) && engineEnabled.equals(DigitalState.HIGH)) {
                                enginStartTime = Instant.now().getEpochSecond();
                                startMove(BlindDirection.UP);
                            }

                            if (topEnabled.equals(DigitalState.LOW))
                                stopMove();


                        } finally {
                            stateLock.unlock();
                        }
                    }

                } catch (InterruptedException ie) {
                    throw new RuntimeException(ie);
                }
            }
        }
    }

    private void handleBottomLed(DigitalStateChangeEvent event) {
        if (event.source().id().equals("input-15")) {
            System.out.println("bottom triggered: " + event.state().getName());
            if (!bottomEnabled.equals(event.state())) {
                bottomEnabled = event.state();

                try {
                    if (stateLock.tryLock(200, TimeUnit.MILLISECONDS)) {
                        try {
                            if (bottomEnabled.equals(DigitalState.HIGH) && engineEnabled.equals(DigitalState.HIGH)) {
                                enginStartTime = Instant.now().getEpochSecond();
                                startMove(BlindDirection.DOWN);
                            }

                            if (bottomEnabled.equals(DigitalState.LOW))
                                stopMove();


                        } finally {
                            stateLock.unlock();
                        }
                    }

                } catch (InterruptedException ie) {
                    throw new RuntimeException(ie);
                }
            }
        }
    }

    private void handleEngine(DigitalStateChangeEvent event) {
        if (event.source().id().equals("input-21")) {
            System.out.println("engine triggered: " + event.state().getName());
            if (!engineEnabled.equals(event.state())) {
                engineEnabled = event.state();

                try {
                    if (stateLock.tryLock(200, TimeUnit.MILLISECONDS)) {
                        try {
                            if (engineEnabled.equals(DigitalState.HIGH)) {
                                enginStartTime = Instant.now().getEpochSecond();

                                if (topEnabled.equals(DigitalState.HIGH))
                                    startMove(BlindDirection.UP);
                                else if (bottomEnabled.equals(DigitalState.HIGH))
                                    startMove(BlindDirection.DOWN);
                                else
                                    addDebugData();

                            } else
                                stopAndResetPosition();

                        } finally {
                            stateLock.unlock();
                        }
                    }

                } catch (InterruptedException ie) {
                    throw new RuntimeException(ie);
                }
            }
        }
    }

    private void startMove(BlindDirection direction) {
        BlindSateDto state = blindState.get(TEST_BLIND_ID);
        state.setInMove(true);
        state.setDirection(direction);
        calculatePosition();

        sendState(false);
        addDebugData();
    }

    private void stopMove() {
        BlindSateDto state = blindState.get(TEST_BLIND_ID);
        state.setInMove(false);
        calculatePosition();

        sendState(true);
        addDebugData();
    }

    private void stopAndResetPosition() {
        BlindSateDto state = blindState.get(TEST_BLIND_ID);
        state.setInMove(false);
        if (state.getDirection().equals(BlindDirection.UP))
            state.setPosition(100);
        else
            state.setPosition(0);

        sendState(true);
        addDebugData();
    }

    @Transactional
    public void sendState(boolean save) {
        simpMessagingTemplate.convertAndSend("/blinds/state", blindState);

        if (save) {
            BlindSateDto state = blindState.get(TEST_BLIND_ID);
            Blind blind = blindDefinitionRepository.getReferenceById(TEST_BLIND_ID);
            blind.updateState(state.getDirection(), state.getPosition());
        }
    }

    private void calculatePosition() {
        BlindSateDto state = blindState.get(TEST_BLIND_ID);
        int workPeriod = (int) (Instant.now().getEpochSecond() - enginStartTime);
        int position = workPeriod * 100 / state.getMoveTime();

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
        debugDataRepository.save(
                DebugData.builder()
                        .enginState(engineEnabled)
                        .topLed(topEnabled)
                        .bottomLed(bottomEnabled)
                        .build()
        );
    }
}
