package com.sip.services;

import com.sip.entities.LargeElement;
import com.sip.repositories.LargeElementRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LargeElementService {

    private final LargeElementRepository largeElementRepository;

    public List<LargeElement> getAll() {
        return largeElementRepository.findAll();
    }

    public LargeElement getById(Long id) {
        return largeElementRepository.findById(id).orElse(null);
    }

    public LargeElement save(LargeElement largeElement) {
        return largeElementRepository.save(largeElement);
    }

    public void delete(Long id) {
        if (largeElementRepository.existsById(id)) {
            largeElementRepository.deleteById(id);
        } else {
            throw new EntityNotFoundException("LargeElement not found with id: " + id);
        }
    }

    // Méthode supplémentaire pour mettre à jour un LargeElement
    public LargeElement update(Long id, LargeElement updatedLargeElement) {
        return largeElementRepository.findById(id)
                .map(existingLargeElement -> {
                    existingLargeElement.setName(updatedLargeElement.getName());
                    existingLargeElement.setPrice(updatedLargeElement.getPrice());
                    return largeElementRepository.save(existingLargeElement);
                })
                .orElseThrow(() -> new EntityNotFoundException("LargeElement not found with id: " + id));
    }
}