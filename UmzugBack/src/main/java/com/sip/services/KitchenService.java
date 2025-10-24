package com.sip.services;

import com.sip.entities.Kitchen;
import com.sip.repositories.KitchenRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class KitchenService {

    private final KitchenRepository kitchenRepository;

    public List<Kitchen> getAll() {
        return kitchenRepository.findAll();
    }

    public Kitchen getById(Long id) {
        return kitchenRepository.findById(id).orElse(null);
    }

    public Kitchen save(Kitchen kitchen) {
        return kitchenRepository.save(kitchen);
    }

    public void delete(Long id) {
        if (kitchenRepository.existsById(id)) {
            kitchenRepository.deleteById(id);
        } else {
            throw new EntityNotFoundException("Kitchen not found with id: " + id);
        }
    }

    public Kitchen update(Long id, Kitchen updatedKitchen) {
        return kitchenRepository.findById(id)
                .map(existingKitchen -> {
                    existingKitchen.setAssemblage(updatedKitchen.isAssemblage());
                    existingKitchen.setDessemblage(updatedKitchen.isDessemblage());
                    existingKitchen.setTransportKitchen(updatedKitchen.isTransportKitchen());
                    existingKitchen.setPrice(updatedKitchen.getPrice());
                    existingKitchen.setNewKitchen(updatedKitchen.isNewKitchen());
                    existingKitchen.setMeters(updatedKitchen.getMeters());  // ADD THIS LINE

                    return kitchenRepository.save(existingKitchen);
                })
                .orElseThrow(() -> new EntityNotFoundException("Kitchen not found with id: " + id));
    }
}