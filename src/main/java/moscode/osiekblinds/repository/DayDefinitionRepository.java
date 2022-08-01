package moscode.osiekblinds.repository;

import moscode.osiekblinds.model.DayDefinition;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DayDefinitionRepository extends JpaRepository<DayDefinition, String> {
}
