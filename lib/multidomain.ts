export interface CyberLog {
  id: string;
  timestamp: string;
  sourceIp: string;
  targetNode: string;
  vector: 'DDoS Attack' | 'Port Scan' | 'Brute Force' | 'SQL Injection' | 'Malware Payload';
  status: 'BLOCKED' | 'QUARANTINED' | 'INVESTIGATING' | 'MITIGATED';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface SatelliteTelemetry {
  name: string;
  orbit: string;
  uplinkStrength: number; // 0 to 100
  bandwidth: string; // e.g. "8.4 Gb/s"
  status: 'NOMINAL' | 'DEGRADED' | 'MAINTENANCE' | 'OFFLINE';
  azimuth: number; // degrees
  elevation: number; // degrees
}

export interface SpaceWeather {
  solarFlareLevel: 'QUIET' | 'MODERATE' | 'ACTIVE' | 'SEVERE';
  geomagneticIndex: string; // e.g. "Kp-3"
  radiationBelt: string; // e.g. "STABLE"
}

const MOCK_IPS = [
  '192.168.42.11', '10.0.4.88', '198.51.100.42', '203.0.113.8', '45.22.189.4',
  '82.102.23.19', '185.220.101.5', '91.240.118.2', '77.88.5.5', '103.22.200.1'
];

const MOCK_NODES = [
  'MAIN_FIREWALL', 'INTEL_DB_01', 'COMMS_UPLINK_EAST', 'SECURE_VAULT_B', 'DMZ_PROXY_04',
  'CORE_ROUTER_10', 'GRID_MONITOR_NORTH', 'RECON_ARCHIVE'
];

const VECTORS: CyberLog['vector'][] = [
  'DDoS Attack', 'Port Scan', 'Brute Force', 'SQL Injection', 'Malware Payload'
];

const STATUSES: CyberLog['status'][] = [
  'BLOCKED', 'QUARANTINED', 'INVESTIGATING', 'MITIGATED'
];

const SEVERITIES: CyberLog['severity'][] = [
  'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
];

export function generateInitialCyberLogs(count = 8): CyberLog[] {
  const logs: CyberLog[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const time = new Date(now.getTime() - i * 45000); // 45s intervals
    logs.push(generateCyberLog(time));
  }
  return logs;
}

export function generateCyberLog(customTime?: Date): CyberLog {
  const timestamp = (customTime || new Date()).toISOString();
  const severity = SEVERITIES[Math.floor(Math.random() * SEVERITIES.length)];
  
  // High severity gets more severe statuses
  let status: CyberLog['status'] = 'BLOCKED';
  if (severity === 'CRITICAL') {
    status = Math.random() > 0.5 ? 'INVESTIGATING' : 'QUARANTINED';
  } else if (severity === 'HIGH') {
    status = Math.random() > 0.3 ? 'BLOCKED' : 'QUARANTINED';
  } else {
    status = Math.random() > 0.4 ? 'BLOCKED' : 'MITIGATED';
  }

  return {
    id: `CYBER-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    timestamp,
    sourceIp: MOCK_IPS[Math.floor(Math.random() * MOCK_IPS.length)],
    targetNode: MOCK_NODES[Math.floor(Math.random() * MOCK_NODES.length)],
    vector: VECTORS[Math.floor(Math.random() * VECTORS.length)],
    status,
    severity
  };
}

export const INITIAL_SATELLITES: SatelliteTelemetry[] = [
  {
    name: "GEO-INTEL-01 (ASIAN_SECTOR)",
    orbit: "GEO / 35,786 km",
    uplinkStrength: 98,
    bandwidth: "12.4 Gb/s",
    status: 'NOMINAL',
    azimuth: 142.5,
    elevation: 41.2
  },
  {
    name: "LEO-RECON-04 (POLAR_ORBIT)",
    orbit: "LEO / 550 km",
    uplinkStrength: 72,
    bandwidth: "8.1 Gb/s",
    status: 'NOMINAL',
    azimuth: 310.1,
    elevation: 85.0
  },
  {
    name: "MEO-COMMS-08 (EUROPE_SECTOR)",
    orbit: "MEO / 20,200 km",
    uplinkStrength: 45,
    bandwidth: "4.2 Gb/s",
    status: 'DEGRADED',
    azimuth: 88.3,
    elevation: 12.8
  },
  {
    name: "LEO-RECON-09 (NORTH_AMERICA)",
    orbit: "LEO / 580 km",
    uplinkStrength: 92,
    bandwidth: "15.0 Gb/s",
    status: 'NOMINAL',
    azimuth: 22.4,
    elevation: 67.9
  },
  {
    name: "GEO-SIGINT-02 (MIDDLE_EAST)",
    orbit: "GEO / 35,780 km",
    uplinkStrength: 0,
    bandwidth: "0.0 Mb/s",
    status: 'OFFLINE',
    azimuth: 198.6,
    elevation: -5.4
  }
];

export const MOCK_SPACE_WEATHER: SpaceWeather = {
  solarFlareLevel: 'MODERATE',
  geomagneticIndex: 'Kp-4',
  radiationBelt: 'STABLE'
};

export function updateSatelliteTelemetry(satellites: SatelliteTelemetry[]): SatelliteTelemetry[] {
  return satellites.map(sat => {
    if (sat.status === 'OFFLINE') return sat;

    // Simulate minor variations in signal, azimuth, and elevation
    const signalVariation = Math.floor((Math.random() - 0.5) * 6);
    const newSignal = Math.max(10, Math.min(100, sat.uplinkStrength + signalVariation));

    const newAzimuth = (sat.azimuth + (Math.random() - 0.5) * 2 + 360) % 360;
    const newElevation = Math.max(-10, Math.min(90, sat.elevation + (Math.random() - 0.5) * 1.5));

    // Random status variation (rarely degrades or recovers)
    let status = sat.status;
    if (Math.random() > 0.98) {
      status = status === 'NOMINAL' ? 'DEGRADED' : 'NOMINAL';
    }

    return {
      ...sat,
      uplinkStrength: newSignal,
      azimuth: parseFloat(newAzimuth.toFixed(1)),
      elevation: parseFloat(newElevation.toFixed(1)),
      status
    };
  });
}
