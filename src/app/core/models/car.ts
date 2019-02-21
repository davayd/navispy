export interface Car {
  id: number;
  make: string;
  model: string;
  lastUpdated: number;
  startTime: string;
  totalPath: number;
  currentSpeed: number;
  currentLocation: string;
  travelTime: string;
}
export interface CarInfo {
  sensors: {
    onboardVoltage: number;
    ignition: boolean;
    GRPS: number;
    DUT: number;
  };
  meter: {
    mileage: number;
    engineHours: number;
  };
  address: string;
  lastMessage: number;
  satellites: number;
  height: number;
  carId: number;
  open?: boolean;
}
