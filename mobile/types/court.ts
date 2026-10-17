interface Facility {
  id: string;
  name: string;
  address: string;
}

interface Court {
  id: string;
  facilityId: string;
  name: string;
  sport: "Tennis" | "Badminton" | "Pickleball";
}