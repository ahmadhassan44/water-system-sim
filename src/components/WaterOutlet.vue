<script setup lang="ts">
interface Props {
  label: string
  isOn: boolean
  flow: number
}

interface Emits {
  (e: 'toggle'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()
</script>

<template>
  <div class="outlet-container">
    <div class="outlet" @click="emit('toggle')">
      <div class="outlet-icon">◆</div>
      <div class="flow-indicator" v-if="isOn">💧</div>
    </div>
    <div class="outlet-info">
      <div class="outlet-label">{{ label }}</div>
      <div class="outlet-flow">{{ flow.toFixed(2) }} L/min</div>
      <div class="outlet-status" :class="{ active: isOn }">
        {{ isOn ? 'ON' : 'OFF' }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.outlet-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.outlet {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.outlet:hover {
  transform: scale(1.1);
}

.outlet-icon {
  font-size: 28px;
  color: #d32f2f;
  transform: rotate(45deg);
}

.flow-indicator {
  position: absolute;
  bottom: -8px;
  font-size: 16px;
  animation: drip 0.8s infinite;
}

@keyframes drip {
  0%, 100% { transform: translateY(0); opacity: 1; }
  50% { transform: translateY(8px); opacity: 0.5; }
}

.outlet-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.outlet-label {
  font-size: 11px;
  font-weight: 600;
  color: #333;
}

.outlet-flow {
  font-size: 10px;
  color: #666;
}

.outlet-status {
  font-size: 9px;
  font-weight: bold;
  color: #f44336;
}

.outlet-status.active {
  color: #4caf50;
}
</style>
