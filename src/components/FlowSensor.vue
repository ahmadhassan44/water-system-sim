<script setup lang="ts">
interface Props {
  label: string
  flow: number
}

defineProps<Props>()
</script>

<template>
  <div class="sensor">
    <div class="sensor-icon">◆</div>
    <div class="sensor-info">
      <div class="sensor-label">{{ label }}</div>
      <div class="sensor-value">{{ flow.toFixed(2) }} L/min</div>
    </div>
  </div>
</template>

<style scoped>
.sensor {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: white;
  border: 2px solid #666;
  border-radius: 4px;
}

.sensor-icon {
  font-size: 24px;
  color: #d32f2f;
  transform: rotate(45deg);
}

.sensor-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sensor-label {
  font-size: 11px;
  font-weight: 600;
  color: #333;
}

.sensor-value {
  font-size: 10px;
  color: #666;
}
</style>
