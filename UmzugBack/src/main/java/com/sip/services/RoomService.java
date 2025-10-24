package com.sip.services;

import com.sip.entities.Room;
import com.sip.repositories.ElementRepository;
import com.sip.repositories.RoomRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;
    private final ElementRepository elementRepository;  // Inject Element repo


    public List<Room> getAll() {
        return roomRepository.findAll();
    }

    public Room getById(Long id) {

        return roomRepository.findById(id).orElse(null);
    }


    public Room save(Room room) {
        return roomRepository.save(room);
    }

    public void delete(Long id) {
        if (roomRepository.existsById(id)) {
            roomRepository.deleteById(id);
        } else {
            throw new EntityNotFoundException("Room not found with id: " + id);
        }
    }
}
