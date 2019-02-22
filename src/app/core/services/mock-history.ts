import { Car } from "../models/car";

export const CARS: Car[] = [
  {
    currentLocation: "ул. Романовская Слобода 7, Минск",
    currentSpeed: 20,
    id: 1,
    lastUpdated: 30,
    make: "KAMAZ",
    model: "A00011",
    totalPath: 1.2,
    startTime: "2:01",
    travelTime: "3 мин."
  },
  {
    currentLocation: "ул. Максима Богдановича 23, Минск",
    currentSpeed: 63,
    id: 2,
    lastUpdated: 5,
    make: "Mercedez",
    model: "A00022",
    totalPath: 30.32,
    startTime: "12:33",
    travelTime: "25 мин."
  },
  {
    currentLocation: "ул. Ульяновская 8, Минск",
    currentSpeed: 29,
    id: 3,
    lastUpdated: 300,
    make: "ГАЗ",
    model: "A00033",
    totalPath: 60.32,
    startTime: "21:23",
    travelTime: "1ч. 23мин."
  }
];
