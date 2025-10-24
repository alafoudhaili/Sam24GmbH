package com.sip.services;

import com.sip.entities.Request;
import com.sip.repositories.RequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RequestService {

    private final RequestRepository requestRepository;

    public List<Request> getAll() {
        return requestRepository.findAll();
    }

    public Request getById(Long id) {
        return requestRepository.findById(id).orElse(null);
    }

    public Request save(Request request) {
        return requestRepository.save(request);
    }

    public void delete(Long id) {
        requestRepository.deleteById(id);
    }
}
