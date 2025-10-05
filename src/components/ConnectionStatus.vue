<script setup lang="ts">
import { useThingsBoardStore, type DeviceType } from '../stores/ThingsBoardStore'

const store = useThingsBoardStore()

const deviceLabels: Record<DeviceType, string> = {
  undergroundTank: 'Underground Tank',
  overheadTank: 'Overhead Tank',
  waterPump: 'Water Pump',
  inflow: 'Inflow Sensor',
  outflow: 'Outflow Sensor',
  washbasin1: 'Wash Basin 1',
  washbasin2: 'Wash Basin 2',
  kitchenSink: 'Kitchen Sink',
  shower: 'Shower'
}
</script>

<template>
  <div class="status-panel">
    <h3>Device Status</h3>
    <div class="status-list">
      <div
        v-for="(device, type) in store.devices"
        :key="type"
        class="status-item"
      >
        <span class="status-indicator" :class="{ connected: device.connected }"></span>
        <span class="device-name">{{ deviceLabels[type as DeviceType] }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.status-panel {
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  min-width: 220px;
}

h3 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #ecf0f1;
  padding-bottom: 8px;
}

.status-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
}

.status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #e74c3c;
  flex-shrink: 0;
  transition: background 0.3s ease;
}

.status-indicator.connected {
  background: #2ecc71;
  box-shadow: 0 0 6px rgba(46, 204, 113, 0.5);
}

.device-name {
  color: #555;
  font-weight: 500;
}
</style>
