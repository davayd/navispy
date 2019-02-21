import { CarInfo } from "../models/car";

export const CARINFO: CarInfo[] = [
  {
    carId: 1,
    address: "ул. Романовская Слобода 7, Минск",
    height: 167,
    lastMessage: 8,
    satellites: 11,
    meter: {
      engineHours: 28174,
      mileage: 808
    },
    sensors: {
      DUT: 306,
      GRPS: 61.29,
      ignition: false,
      onboardVoltage: 24.29
    }
  },
  {
    carId: 2,
    address: "ул. Максима Богдановича 23, Минск",
    height: 38,
    lastMessage: 300,
    satellites: 17,
    meter: {
      engineHours: 71400,
      mileage: 2440
    },
    sensors: {
      DUT: 12,
      GRPS: 61.29,
      ignition: true,
      onboardVoltage: 12.79
    }
  },
  {
    carId: 3,
    address: "ул. Ульяновская 8, Минск",
    height: 38,
    lastMessage: 300,
    satellites: 17,
    meter: {
      engineHours: 70710,
      mileage: 3262
    },
    sensors: {
      DUT: 12,
      GRPS: 61.29,
      ignition: false,
      onboardVoltage: 13
    }
  }
];
