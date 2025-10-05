<script setup lang="ts">
import { useWaterSimulation } from '../stores/WaterSimulation'

const simulation = useWaterSimulation()
</script>

<template>
  <div class="controls-panel">
    <h3>Simulation Controls</h3>

    <button
      class="control-btn"
      :class="{ active: simulation.isRunning }"
      @click="simulation.isRunning ? simulation.stopSimulation() : simulation.startSimulation()"
    >
      {{ simulation.isRunning ? '⏸ Stop Simulation' : '▶ Start Simulation' }}
    </button>

    <div class="info-section" v-if="simulation.isRunning">
      <div class="info-item">
        <span class="label">Underground Tank:</span>
        <span class="value">{{ simulation.undergroundTankLevel.toFixed(1) }}L</span>
      </div>
      <div class="info-item">
        <span class="label">Overhead Tank:</span>
        <span class="value">{{ simulation.overheadTankLevel.toFixed(1) }}L</span>
      </div>
      <div class="info-item">
        <span class="label">Pump:</span>
        <span class="value" :class="{ active: simulation.pumpOn }">
          {{ simulation.pumpOn ? 'ON' : 'OFF' }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.controls-panel {
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

.control-btn {
  width: 100%;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  background: #3498db;
  color: white;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.control-btn:hover {
  background: #2980b9;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.3);
}

.control-btn.active {
  background: #e74c3c;
}

.control-btn.active:hover {
  background: #c0392b;
}

.info-section {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  padding: 6px 0;
  border-bottom: 1px solid #ecf0f1;
}

.info-item:last-child {
  border-bottom: none;
}

.label {
  color: #7f8c8d;
  font-weight: 500;
}

.value {
  color: #2c3e50;
  font-weight: 600;
}

.value.active {
  color: #27ae60;
}
</style>
