export interface Car {
  id: number;
  name: string;
  // make: string;
  // model: string;
  // lastUpdated: number;
  // startTime: string;
  // totalPath: number;
  // currentSpeed: number;
  // currentLocation: string;
  // travelTime: string;
}
export interface CarInfo {
  other: {
    protocol?: string;
    satellites?: string;
    hdop?: string;
    io5?: string;
    io27?: string;
    io207?: string;
    io32?: string;
    io173?: string;
    io159?: string;
    io29?: string;
    io30?: string;
    io22?: string;
    io197?: string;
    io89?: string;
    io116?: [string, string];
    io170?: string;
    io41?: string;
    io52?: string;
    io211?: string;
    io67?: string;
    io23?: string;
    io53?: string;
    io54?: string;
    io55?: string;
    io114?: string;
    io208?: string;
    io92?: string;
    io65?: string;
    io155?: string;
    io156?: string;
    open?: boolean;
  };
  mileage: string;
  DUT1: string;
  DUT2: string;
  DUT3: string;
  speed: string;
  latitude: string;
  longitude: string;
  course: number;
  time: string;
}

export interface CarHistory {
  carId?: number;
  startTime: string;
  status: string;
  travelTime?: string;
  totalPath?: number;
  averageSpeed?: number;
  currentLocation?: string;
  volume?: number;
}
