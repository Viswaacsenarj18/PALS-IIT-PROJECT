// Mock sensor data for the agriculture monitoring system
export interface SensorData {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  icon: string;
  description: string;
  min?: number;
  max?: number;
  history?: number[];
}

export interface TractorData {
  id: string;
  ownerName: string;
  email?: string;
  phone: string;
  location: string;
  model: string;
  tractorNumber: string;
  horsepower?: number;
  fuelType?: string;
  rentPerHour: number;
  rentPerDay: number;
  isAvailable: boolean;
  imageUrl: string;
  specifications: {
    engine: string;
    horsepower: number;
    fuelType: string;
    transmission: string;
  };
}

export const sensorData: SensorData[] = [
  {
    id: 'soil-moisture',
    name: 'Soil Moisture',
    value: 68,
    unit: '%',
    status: 'good',
    icon: 'Droplets',
    description: 'Optimal moisture level for crop growth',
    min: 0,
    max: 100,
    history: [62, 65, 68, 70, 72, 68, 65, 68],
  },
  {
    id: 'temperature',
    name: 'Temperature',
    value: 28,
    unit: '°C',
    status: 'good',
    icon: 'Thermometer',
    description: 'Current field temperature',
    min: -10,
    max: 50,
    history: [24, 26, 28, 30, 32, 30, 28, 28],
  },
  {
    id: 'humidity',
    name: 'Humidity',
    value: 75,
    unit: '%',
    status: 'warning',
    icon: 'CloudRain',
    description: 'Atmospheric humidity level',
    min: 0,
    max: 100,
    history: [70, 72, 74, 76, 78, 76, 75, 75],
  },
  {
    id: 'water-level',
    name: 'Water Level',
    value: 85,
    unit: '%',
    status: 'good',
    icon: 'Waves',
    description: 'Irrigation tank water level',
    min: 0,
    max: 100,
    history: [90, 88, 86, 85, 84, 85, 85, 85],
  },
  {
    id: 'motor-status',
    name: 'Motor Status',
    value: 1,
    unit: '',
    status: 'good',
    icon: 'Cog',
    description: 'Irrigation pump motor status',
    history: [1, 1, 0, 0, 1, 1, 1, 1],
  },
  {
    id: 'ph-level',
    name: 'Soil pH',
    value: 6.5,
    unit: '',
    status: 'good',
    icon: 'FlaskConical',
    description: 'Soil acidity level',
    min: 0,
    max: 14,
    history: [6.3, 6.4, 6.5, 6.5, 6.6, 6.5, 6.5, 6.5],
  },
  {
    id: 'nitrogen',
    name: 'Nitrogen (N)',
    value: 45,
    unit: 'mg/kg',
    status: 'good',
    icon: 'Leaf',
    description: 'Nitrogen content in soil',
    min: 0,
    max: 100,
    history: [42, 43, 44, 45, 46, 45, 45, 45],
  },
  {
    id: 'phosphorus',
    name: 'Phosphorus (P)',
    value: 28,
    unit: 'mg/kg',
    status: 'good',
    icon: 'Zap',
    description: 'Phosphorus content in soil',
    min: 0,
    max: 50,
    history: [26, 27, 28, 28, 29, 28, 28, 28],
  },
  {
    id: 'potassium',
    name: 'Potassium (K)',
    value: 52,
    unit: 'mg/kg',
    status: 'warning',
    icon: 'Shield',
    description: 'Potassium content in soil',
    min: 0,
    max: 80,
    history: [50, 51, 51, 52, 52, 53, 52, 52],
  },
  {
    id: 'motor-status-2',
    name: 'Motor Status 2',
    value: 0,
    unit: '',
    status: 'good',
    icon: 'Cog',
    description: 'Secondary irrigation pump motor status',
    history: [0, 0, 1, 1, 0, 0, 0, 0],
  },
  {
    id: 'valve-1',
    name: 'Valve 1',
    value: 1,
    unit: '',
    status: 'good',
    icon: 'Droplet',
    description: 'Main irrigation valve status',
    history: [1, 1, 1, 1, 1, 1, 1, 1],
  },
  {
    id: 'valve-2',
    name: 'Valve 2',
    value: 0,
    unit: '',
    status: 'good',
    icon: 'Droplet',
    description: 'Secondary irrigation valve status',
    history: [0, 0, 0, 0, 0, 0, 0, 0],
  },
];

export const tractorData: TractorData[] = [
  {
    id: '1',
    ownerName: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    location: 'Punjab, Ludhiana',
    model: 'Mahindra 575 DI',
    tractorNumber: 'PB-10-AB-1234',
    rentPerHour: 500,
    rentPerDay: 3500,
    isAvailable: true,
    imageUrl: '/placeholder.svg',
    specifications: {
      engine: '2730 CC',
      horsepower: 47,
      fuelType: 'Diesel',
      transmission: '8 Forward + 2 Reverse',
    },
  },
  {
    id: '2',
    ownerName: 'Suresh Patel',
    phone: '+91 87654 32109',
    location: 'Gujarat, Ahmedabad',
    model: 'John Deere 5050D',
    tractorNumber: 'GJ-01-CD-5678',
    rentPerHour: 700,
    rentPerDay: 5000,
    isAvailable: true,
    imageUrl: '/placeholder.svg',
    specifications: {
      engine: '2900 CC',
      horsepower: 50,
      fuelType: 'Diesel',
      transmission: '9 Forward + 3 Reverse',
    },
  },
  {
    id: '3',
    ownerName: 'Amit Singh',
    phone: '+91 76543 21098',
    location: 'Haryana, Karnal',
    model: 'Swaraj 744 FE',
    tractorNumber: 'HR-12-EF-9012',
    rentPerHour: 450,
    rentPerDay: 3000,
    isAvailable: false,
    imageUrl: '/placeholder.svg',
    specifications: {
      engine: '2500 CC',
      horsepower: 44,
      fuelType: 'Diesel',
      transmission: '8 Forward + 2 Reverse',
    },
  },
  {
    id: '4',
    ownerName: 'Vikram Reddy',
    phone: '+91 65432 10987',
    location: 'Telangana, Hyderabad',
    model: 'TAFE 45 DI',
    tractorNumber: 'TS-09-GH-3456',
    rentPerHour: 400,
    rentPerDay: 2800,
    isAvailable: true,
    imageUrl: '/placeholder.svg',
    specifications: {
      engine: '2400 CC',
      horsepower: 45,
      fuelType: 'Diesel',
      transmission: '8 Forward + 2 Reverse',
    },
  },
  {
    id: '5',
    ownerName: 'Mohan Das',
    phone: '+91 54321 09876',
    location: 'Karnataka, Bangalore',
    model: 'Sonalika DI 60',
    tractorNumber: 'KA-05-IJ-7890',
    rentPerHour: 600,
    rentPerDay: 4200,
    isAvailable: true,
    imageUrl: '/placeholder.svg',
    specifications: {
      engine: '3000 CC',
      horsepower: 60,
      fuelType: 'Diesel',
      transmission: '10 Forward + 2 Reverse',
    },
  },
];

export const getWaterLevelLabel = (value: number): string => {
  if (value >= 70) return 'Full';
  if (value >= 40) return 'Medium';
  return 'Low';
};

export const getStatusColor = (status: 'good' | 'warning' | 'critical'): string => {
  switch (status) {
    case 'good':
      return 'success';
    case 'warning':
      return 'warning';
    case 'critical':
      return 'danger';
    default:
      return 'muted';
  }
};
