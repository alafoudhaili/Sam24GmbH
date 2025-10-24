package com.sip.controllers;

import com.sip.entities.*;
import com.sip.services.UmzugPriceCalculator;
import com.sip.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

@RestController
@RequestMapping("/api/umzug")
@CrossOrigin(origins = "http://localhost:4200")
public class RequestController {

    @Autowired
    private RequestRepository umzugRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private KitchenRepository kitchenRepository;

    @Autowired
    private UmzugPriceCalculator priceCalculator;

    @GetMapping("/rooms")
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    @GetMapping
    public Page<Request> getAllRequestsPageable(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);  // No sort applied here
        return umzugRepository.findAll(pageable); // Returns Page<Request> (entities)
    }
    @GetMapping("/{id}")
    public ResponseEntity<Request> getRequestById(@PathVariable Long id) {
        Optional<Request> request = umzugRepository.findById(id);
        if (request.isPresent()) {
            return ResponseEntity.ok(request.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/kitchens")
    public List<Kitchen> getAllKitchens() {
        return kitchenRepository.findAll();
    }

    @PostMapping("/calculate")
    public Float calculatePrice(@RequestBody Request umzug) {
        return priceCalculator.calculateTotalPrice(umzug);
    }

    @PostMapping("/save")
    public Request saveUmzug(@RequestBody Request umzug) {
        // wire back-references
        if (umzug.getRooms() != null) {
            for (RequestRoom rr : umzug.getRooms()) {
                rr.setRequest(umzug);
                if (rr.getElements() != null) {
                    for (Element e : rr.getElements()) {
                        e.setRequestRoom(rr);
                        // compute q2 if needed
                        if (e.getWidth() != null && e.getHeight() != null && e.getLength() != null) {
                            e.setQ2(((e.getWidth() * e.getHeight() * e.getLength())*e.getNumberElement()) / 1_000_000f);
                        }
                    }
                }
            }
        }

        // compute totals
        float totalVolume = (float) umzug.getRooms().stream()
                .filter(r -> r.getElements() != null)
                .flatMap(r -> r.getElements().stream())
                .mapToDouble(e -> (e.getWidth() * e.getHeight() * e.getLength()) / 1_000_000d)
                .sum();
        umzug.setTotalVolumeM3(totalVolume);

        umzug.setTotalPrice(priceCalculator.calculateTotalPrice(umzug));

        return umzugRepository.save(umzug);
    }
    @PutMapping("/{id}")
    public ResponseEntity<Request> updateRequest(@PathVariable Long id, @RequestBody Request updatedRequest) {
        if (!umzugRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        updatedRequest.setId_request(id);

        // wire back-references for updated request
        if (updatedRequest.getRooms() != null) {
            for (RequestRoom rr : updatedRequest.getRooms()) {
                rr.setRequest(updatedRequest);
                if (rr.getElements() != null) {
                    for (Element e : rr.getElements()) {
                        e.setRequestRoom(rr);
                        // compute q2 if needed
                        if (e.getWidth() != null && e.getHeight() != null && e.getLength() != null) {
                            e.setQ2((e.getWidth() * e.getHeight() * e.getLength()) / 1_000_000f);
                        }
                    }
                }
            }
        }

        // compute totals
        float totalVolume = (float) updatedRequest.getRooms().stream()
                .filter(r -> r.getElements() != null)
                .flatMap(r -> r.getElements().stream())
                .mapToDouble(e -> (e.getWidth() * e.getHeight() * e.getLength()) / 1_000_000d)
                .sum();
        updatedRequest.setTotalVolumeM3(totalVolume);
        updatedRequest.setTotalPrice(priceCalculator.calculateTotalPrice(updatedRequest));

        Request savedRequest = umzugRepository.save(updatedRequest);
        return ResponseEntity.ok(savedRequest);
    }

    // DELETE endpoint
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRequest(@PathVariable Long id) {
        if (umzugRepository.existsById(id)) {
            umzugRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // SEARCH by client name endpoint
    @GetMapping("/search")
    public Page<Request> searchByClientName(
            @RequestParam String clientName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return umzugRepository.findByClientNameContainingIgnoreCase(clientName, pageable);
    }

    // SEARCH by price range endpoint
    @GetMapping("/price-range")
    public Page<Request> getByPriceRange(
            @RequestParam Float minPrice,
            @RequestParam Float maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return umzugRepository.findByTotalPriceBetween(minPrice, maxPrice, pageable);
    }
}