package com.sip.services;

import com.sip.entities.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Stream;

@Service
public class UmzugPriceCalculator {

    private static final Float PRICE_PER_M3 = 35.0f;
    private static final Float PRICE_PER_KARTON = 2.75f;
    private static final Float PRICE_PER_KM = 2.0f;
    private static final Float MIN_DISTANCE_FREE = 20.0f;
    private static final Float ETAGE_PRICE_WITHOUT_ELEVATOR = 50.0f;
    private static final Float ETAGE_PRICE_WITH_ELEVATOR = 25.0f;
    private static final Float DEMONTAGE_PRICE = 100.0f;

    private static final Float MONTAGE_PRICE = 150.0f;

    private static final Float DEMONTAGELAMP_PRICE = 50.0f;

    private static final Float MONTAGELAMP_PRICE = 40.0f;

    private static final Float WITHOUT_PARKPLATZ_PRICE = 70.0f;

    public Float calculateTotalPrice(Request umzug) {
        Float totalPrice = 0.0f;

        // Calculate volume price (M3 * 35€)
        float totalVolume = (float) umzug.getRooms().stream()
                .filter(r -> r.getElements() != null)
                .flatMap(r -> r.getElements().stream())
                .mapToDouble(e -> (e.getWidth() * e.getHeight() * e.getLength()) / 1_000_000d)
                .sum();
        totalPrice += totalVolume * PRICE_PER_M3;

        // Calculate kartons price
        totalPrice += umzug.getNumberOfKartons() * PRICE_PER_KARTON;

        // Calculate distance price (if > 20km)
        if (umzug.getDistanceKm() > MIN_DISTANCE_FREE) {
            Float extraDistance = umzug.getDistanceKm() - MIN_DISTANCE_FREE;
            totalPrice += extraDistance * PRICE_PER_KM;
        }

        // Calculate etage price
        if (umzug.getWithElevatorDepart()) {
            totalPrice += umzug.getNumberOfEtagesDepart() * ETAGE_PRICE_WITH_ELEVATOR;
        } else {
            totalPrice += umzug.getNumberOfEtagesDepart() * ETAGE_PRICE_WITHOUT_ELEVATOR;
        }
        if (umzug.getWithElevatorArrival()) {
            totalPrice += umzug.getNumberOfEtagesArrival() * ETAGE_PRICE_WITH_ELEVATOR;
        } else {
            totalPrice += umzug.getNumberOfEtagesArrival() * ETAGE_PRICE_WITHOUT_ELEVATOR;
        }
        // Calculate demontage price
        if (umzug.getWithDemontage()) {
            totalPrice += DEMONTAGE_PRICE;
        }
        if (umzug.getWithMontage()) {
            totalPrice += MONTAGE_PRICE;
        }
        if (umzug.getWithDemontageLamp()) {
            totalPrice += DEMONTAGELAMP_PRICE;
        }
        if (umzug.getWithMontageLamp()) {
            totalPrice += MONTAGELAMP_PRICE;
        }
        if (!umzug.getWithParkPlatzDepart()) {
            totalPrice += WITHOUT_PARKPLATZ_PRICE;
        }
        if (!umzug.getWithParkPlatzArrival()) {
            totalPrice += WITHOUT_PARKPLATZ_PRICE;
        }
        // Add kitchen service price if selected
        if (umzug.getKitchen() != null) {
            totalPrice += umzug.getKitchen().getPrice();
        }

        return totalPrice;
    }

    private Float calculateTotalVolume(Stream<Element> mobelsStream) {
        return mobelsStream
                .map(mobel -> mobel.getWidth() * mobel.getHeight() * mobel.getLength())
                .reduce(0.0f, Float::sum);
    }
}
