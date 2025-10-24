package com.sip.services;

import com.sip.entities.Element;
import com.sip.entities.Room;
import com.sip.repositories.ElementRepository;
import com.sip.repositories.RoomRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ElementService {

    private final ElementRepository elementRepository;


    public List<Element> getAll() {
        return elementRepository.findAll();
    }

    public Element getById(Long id) {

        return elementRepository.findById(id).orElse(null);
    }


    public Element save(Element element) {
        return elementRepository.save(element);
    }

    public void delete(Long id) {
        if (elementRepository.existsById(id)) {
            elementRepository.deleteById(id);
        } else {
            throw new EntityNotFoundException("Element not found with id: " + id);
        }
    }
}
