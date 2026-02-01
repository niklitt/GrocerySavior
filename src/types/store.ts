export interface Location {
  lat: number;
  lng: number;
}

export interface Store {
  id: string;
  name: string;
  location: Location;
  address: string;
}

export interface StoreDistance {
  store: Store;
  distanceMiles: number;
}
