import { SensorData } from '@/data/mockData';
import {
  Droplets,
  Thermometer,
  CloudRain,
  Waves,
  Cog,
  FlaskConical,
  Leaf,
  Zap,
  Shield,
  Droplet,
  Power,
} from 'lucide-react';

interface SensorCardProps {
  sensor: SensorData;
  onToggle?: (sensorId: string) => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Droplets,
  Thermometer,
  CloudRain,
  Waves,
  Cog,
  FlaskConical,
  Leaf,
  Zap,
  Shield,
  Droplet,
};

const SensorCard = ({ sensor, onToggle }: SensorCardProps) => {
  const Icon = iconMap[sensor.icon] || Droplets;
  const isToggleable = sensor.id === 'motor-status' || sensor.id === 'motor-status-2' || sensor.id === 'valve-1' || sensor.id === 'valve-2';

  const getStatusClass = () => {
    switch (sensor.status) {
      case 'good':
        return 'sensor-card-success';
      case 'warning':
        return 'sensor-card-warning';
      case 'critical':
        return 'sensor-card-danger';
      default:
        return '';
    }
  };

  const getStatusBgColor = () => {
    switch (sensor.status) {
      case 'good':
        return 'bg-success/10';
      case 'warning':
        return 'bg-warning/10';
      case 'critical':
        return 'bg-danger/10';
      default:
        return 'bg-muted';
    }
  };

  const getStatusTextColor = () => {
    switch (sensor.status) {
      case 'good':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'critical':
        return 'text-danger';
      default:
        return 'text-muted-foreground';
    }
  };

  const getDisplayValue = () => {
    if (sensor.id === 'motor-status' || sensor.id === 'motor-status-2') {
      return sensor.value === 1 ? 'ON' : 'OFF';
    }
    if (sensor.id === 'valve-1' || sensor.id === 'valve-2') {
      return sensor.value === 1 ? 'OPEN' : 'CLOSED';
    }
    if (sensor.id === 'water-level') {
      if (sensor.value >= 70) return 'Full';
      if (sensor.value >= 40) return 'Medium';
      return 'Low';
    }
    return `${sensor.value}${sensor.unit}`;
  };

  return (
    <div className={`sensor-card ${getStatusClass()}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${getStatusBgColor()}`}>
          <Icon className={`h-6 w-6 ${getStatusTextColor()}`} />
        </div>
        <div
          className={`h-3 w-3 rounded-full ${
            sensor.status === 'good'
              ? 'bg-success'
              : sensor.status === 'warning'
              ? 'bg-warning'
              : 'bg-danger'
          } animate-pulse-slow`}
        />
      </div>

      {/* Value */}
      <div className="mb-2">
        <span className={`font-display text-3xl font-bold ${getStatusTextColor()}`}>
          {getDisplayValue()}
        </span>
      </div>

      {/* Label */}
      <h3 className="font-semibold text-foreground mb-1">{sensor.name}</h3>
      <p className="text-sm text-muted-foreground">{sensor.description}</p>

      {/* Progress bar for applicable sensors */}
      {!isToggleable && sensor.max && (
        <div className="mt-4">
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                sensor.status === 'good'
                  ? 'bg-success'
                  : sensor.status === 'warning'
                  ? 'bg-warning'
                  : 'bg-danger'
              }`}
              style={{ width: `${(sensor.value / sensor.max) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Toggle Button for Motors and Valves */}
      {isToggleable && onToggle && (
        <button
          onClick={() => onToggle(sensor.id)}
          className={`w-full mt-4 py-2 px-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-sm ${
            sensor.value === 1
              ? 'bg-danger/20 text-danger hover:bg-danger/30'
              : 'bg-success/20 text-success hover:bg-success/30'
          }`}
        >
          <Power className="h-4 w-4" />
          {sensor.id.includes('valve') 
            ? (sensor.value === 1 ? 'Close' : 'Open')
            : (sensor.value === 1 ? 'Turn OFF' : 'Turn ON')
          }
        </button>
      )}
    </div>
  );
};

export default SensorCard;
