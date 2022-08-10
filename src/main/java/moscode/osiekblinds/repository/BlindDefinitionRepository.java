package moscode.osiekblinds.repository;

import moscode.osiekblinds.model.Blind;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BlindDefinitionRepository extends JpaRepository<Blind, Integer> {
}
