import { ModelMetrics, ZoneState, StreamFrame } from '../types';

const API_BASE = '/api';

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

export async function fetchSimulationFrame(): Promise<StreamFrame> {
  const res = await fetch(`${API_BASE}/simulation/frame`);
  return res.json();
}

export async function fetchZones(): Promise<ZoneState[]> {
  const res = await fetch(`${API_BASE}/zones`);
  return res.json();
}

export async function fetchRisk() {
  const res = await fetch(`${API_BASE}/risk`);
  return res.json();
}

export async function fetchAlerts() {
  const res = await fetch(`${API_BASE}/alerts`);
  return res.json();
}

export async function fetchModelPerformance(): Promise<ModelMetrics> {
  const res = await fetch(`${API_BASE}/model-performance`);
  return res.json();
}

export async function setScenario(scenario: string, customParams?: Record<string, number>) {
  const res = await fetch(`${API_BASE}/simulation/scenario`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scenario, custom_params: customParams }),
  });
  return res.json();
}

export async function setSimulationSpeed(speed: number) {
  const res = await fetch(`${API_BASE}/simulation/speed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ speed }),
  });
  return res.json();
}

export async function startSimulation() {
  const res = await fetch(`${API_BASE}/simulation/start`, { method: 'POST' });
  return res.json();
}

export async function pauseSimulation() {
  const res = await fetch(`${API_BASE}/simulation/pause`, { method: 'POST' });
  return res.json();
}

export async function resetSimulation() {
  const res = await fetch(`${API_BASE}/simulation/reset`, { method: 'POST' });
  return res.json();
}

export async function updateSensorStatus(sensorId: string, status: string) {
  const res = await fetch(`${API_BASE}/sensors/${sensorId}/status?status=${status}`, {
    method: 'POST',
  });
  return res.json();
}
