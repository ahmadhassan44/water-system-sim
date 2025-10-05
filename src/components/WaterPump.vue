<script setup lang="ts">
interface Props {
  isOn: boolean
}

interface Emits {
  (e: 'toggle'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()
</script>

<template>
  <div class="pump-container">
    <div class="pump" :class="{ active: isOn }">
      <div class="pump-circle">
        <div class="pump-label">PUMP</div>
      </div>
    </div>
    <button class="pump-switch" :class="{ on: isOn }" @click="emit('toggle')">
      <div class="switch-indicator"></div>
      <span>{{ isOn ? 'ON' : 'OFF' }}</span>
    </button>
  </div>
</template>

<style scoped>
.pump-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.pump {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pump-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #90a4ae;
  border: 3px solid #546e7a;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.pump.active .pump-circle {
  background: #42a5f5;
  border-color: #1976d2;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.pump-label {
  font-weight: bold;
  font-size: 14px;
  color: white;
}

.pump-switch {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border: 2px solid #666;
  border-radius: 20px;
  background: #f44336;
  color: white;
  font-weight: bold;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pump-switch.on {
  background: #4caf50;
}

.switch-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: white;
}
</style>
