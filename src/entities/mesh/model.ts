export interface MeshNode {
  nodeId: string;
  status: 'active' | 'suspended' | 'offline';
  batteryLevel: number; // 0 to 1
  cpuUsage: number;     // 0 to 1
}

export interface MeshSession {
  id: string;
  status: 'running' | 'suspended' | 'stopped';
  shardsTransmitted: number;
  cpuUsage: number;
  batteryLevel: number;
  suspendedReason?: 'CPU_EXCEEDED' | 'BATTERY_LOW';
}

// LSC Guard thresholds (BR-MIGRAR-004)
export const LSC_MAX_CPU = 0.05;      // 5% max CPU usage
export const LSC_MIN_BATTERY = 0.20;  // 20% min battery level

/**
 * Checks if the system resources satisfy LSC Guard parameters.
 */
export function checkResourceSafety(cpuUsage: number, batteryLevel: number): {
  safe: boolean;
  reason?: 'CPU_EXCEEDED' | 'BATTERY_LOW';
} {
  if (cpuUsage > LSC_MAX_CPU) {
    return { safe: false, reason: 'CPU_EXCEEDED' };
  }
  if (batteryLevel < LSC_MIN_BATTERY) {
    return { safe: false, reason: 'BATTERY_LOW' };
  }
  return { safe: true };
}

/**
 * Creates a new MeshSession.
 */
export function startMeshSession(id: string, initialCpu: number, initialBattery: number): MeshSession {
  const safety = checkResourceSafety(initialCpu, initialBattery);
  
  return {
    id,
    status: safety.safe ? 'running' : 'suspended',
    shardsTransmitted: 0,
    cpuUsage: initialCpu,
    batteryLevel: initialBattery,
    suspendedReason: safety.reason
  };
}

/**
 * Updates the resource metrics of a session, triggering suspension or resumption
 * of background processing depending on LSC Guard checks.
 */
export function updateMetrics(
  session: MeshSession,
  cpuUsage: number,
  batteryLevel: number
): { session: MeshSession; eventTriggered?: 'ProcessingSuspended' | 'ProcessingResumed' } {
  const safety = checkResourceSafety(cpuUsage, batteryLevel);
  const newStatus = safety.safe ? 'running' : 'suspended';
  
  let eventTriggered: 'ProcessingSuspended' | 'ProcessingResumed' | undefined;
  
  if (session.status === 'running' && newStatus === 'suspended') {
    eventTriggered = 'ProcessingSuspended';
  } else if (session.status === 'suspended' && newStatus === 'running') {
    eventTriggered = 'ProcessingResumed';
  }

  return {
    session: {
      ...session,
      cpuUsage,
      batteryLevel,
      status: newStatus,
      suspendedReason: safety.reason
    },
    eventTriggered
  };
}

/**
 * Increments the successfully transmitted shard count.
 */
export function recordShardTransmission(session: MeshSession): MeshSession {
  if (session.status !== 'running') return session;
  return {
    ...session,
    shardsTransmitted: session.shardsTransmitted + 1
  };
}
