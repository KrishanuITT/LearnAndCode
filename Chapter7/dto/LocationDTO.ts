export class LocationDTO {
    constructor(
      public name: string,
      public country: string,
      public latitude: number,
      public longitude: number
    ) {}
  
    format() {
      return `City: ${this.name}, Country: ${this.country}\nLatitude: ${this.latitude}, Longitude: ${this.longitude}`;
    }
  }
  