package com.sip.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sip.entities.Element;
import com.sip.entities.ResponseMessage;
import com.sip.entities.Room;
import com.sip.exceptions.NotAnImageFileException;
import com.sip.services.ElementService;
import com.sip.services.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

import static org.springframework.http.MediaType.IMAGE_JPEG_VALUE;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/element")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ElementController {

    private final ElementService elementService;
    private final RoomService roomService;


    @GetMapping("")
    public List<Element> getAll() {
        return elementService.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        Element element = elementService.getById(id);
        if (element != null) {
            return new ResponseEntity<>(element, HttpStatus.OK);
        }
        return new ResponseEntity<>("This element doesn't exist", HttpStatus.OK);
    }

    @PostMapping(value = "/add")
    public ResponseEntity save(  @RequestParam("element") String elementJson,
                                 @RequestParam(value = "file", required = false) MultipartFile file) throws IOException, NotAnImageFileException {
        ObjectMapper objectMapper = new ObjectMapper();
        Element element = objectMapper.readValue(elementJson, Element.class);
        if (file != null) {
            elementService.saveElementImage(element,file);
        }
        Element result = elementService.save(element);
        if (result != null) {
            return new ResponseEntity<>(result, HttpStatus.OK);
        }
        return new ResponseEntity<>("Problem with adding element", HttpStatus.BAD_REQUEST);
    }

    @PutMapping(value = "/edit")
    public ResponseEntity update(@RequestBody Element newElement){

        Element elementToUpdate = elementService.getById(newElement.getId_element());
        elementToUpdate.setNumberElement(newElement.getNumberElement());

        elementToUpdate.setName(newElement.getName());
        elementToUpdate.setWidth(newElement.getWidth());
        elementToUpdate.setHeight(newElement.getHeight());
        elementToUpdate.setLength(newElement.getLength());
        elementToUpdate.setQ2(newElement.getQ2());
        elementToUpdate.setPrice(newElement.getPrice());

        try {
            Element result = elementService.save(elementToUpdate);

            return new ResponseEntity<>(result, HttpStatus.OK);

        } catch (Exception e) {

            return new ResponseEntity<>(new ResponseMessage(e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity delete(@PathVariable("id") long id) {
        Element request = elementService.getById(id);
        if(request!=null){
            this.elementService.delete(id);
            return new ResponseEntity<>(request,HttpStatus.OK);
        }
        return new ResponseEntity<>("This element doesn't exist", HttpStatus.BAD_REQUEST);
    }

    @GetMapping(path = "/image/{fileName}", produces = IMAGE_JPEG_VALUE)
    public byte[] getSettingsLogo( @PathVariable("fileName") String fileName) throws IOException {
        return Files.readAllBytes(Paths.get("uploads/element/" + fileName));
    }

}
