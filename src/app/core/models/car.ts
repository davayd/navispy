export interface Car {
  id: number;
  name: string;
  address: string;
}
export interface CarInfo {
  other?: {
    [key: string]: any;
  };
  address?: string;
  time?: string;
  params?: Indicator[];
  latitude?: number;
  longitude?: number;
  course?: number;
}

export interface Indicator {
  key?: string;
  displayName?: string;
  displayUnit?: string;
  displayValue?: number;
}
export interface CarMotionHistory {
  breakdown: CarMotionBreakdown[];
  mileageTotal: number;
  driveTimeTotal: number;
  parkingTimeTotal: number;
}
export interface CarMotionBreakdown {
  ID: number;
  timeStart: string;
  timeFinish: string;
  motion: string;
  addressStart: string;
  addressFinish: string;
  mileage: any;
  time: string;
  time2: number;
  latStart: string;
  lonStart: string;
  latFinish: string;
  lonFinish: string;
}

export interface CarTrack {
  calcTime: string;
  route: { [key: string]: CarTrackDetails };
  numPoints: number;
}

export interface CarTrackDetails {
  protocol: string;
  speed: number;
  mileage: number;
  APC1: number;
  APC2: number;
  APC3: number;
  APC4: number;
  APC_IN_SENSOR: string;
  APC_OUT_SENSOR: string;
  k1: string;
  k2: string;
  k3: string;
  k4: string;
  k5: string;
  k6: string;
  b: string;
  hasAPC: string;
  time: string;
  unixTime: string;
  other: string;
  latitude: number;
  longitude: number;
  course: string;
}

export interface CarMotionTotals {
  mileage?: number;
  driveTime?: number;
  parkingTime?: number;
}
