package com.sip.controllers;

import com.sip.entities.Element;
import com.sip.entities.LargeElement;
import com.sip.entities.ResponseMessage;
import com.sip.entities.Room;
import com.sip.services.ElementService;
import com.sip.services.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/room")
@CrossOrigin(origins = "*", maxAge = 3600)
public class RoomController {

    private final RoomService roomService;
    private final ElementService elementService;


    @GetMapping("")
    public List<Room> getAll() {
        return roomService.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        Room room = roomService.getById(id);
        if (room != null) {
            return new ResponseEntity<>(room, HttpStatus.OK);
        }
        return new ResponseEntity<>("This room doesn't exist", HttpStatus.OK);
    }

    @PostMapping(value = "/add")
    public ResponseEntity save(@RequestBody Room room ){


        Room result = roomService.save(room);
        if (result != null) {
            return new ResponseEntity<>(result, HttpStatus.OK);
        }
        return new ResponseEntity<>("Problem with adding room", HttpStatus.BAD_REQUEST);
    }

    @PutMapping(value = "/edit")
    public ResponseEntity update(@RequestBody Room newRoom){

        Room roomToUpdate = roomService.getById(newRoom.getId_room());

        roomToUpdate.setName(newRoom.getName());
        try {
            Room result = roomService.save(roomToUpdate);

            return new ResponseEntity<>(result, HttpStatus.OK);

        } catch (Exception e) {

            return new ResponseEntity<>(new ResponseMessage(e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") long id) {
        Room room = roomService.getById(id);
        if(room != null) {
            roomService.delete(id);
            return ResponseEntity.ok(Map.of("message", "Room deleted successfully"));
        }
        return ResponseEntity.badRequest().body(Map.of("error", "This room doesn't exist"));
    }

}
