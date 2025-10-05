<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  label: string
  level: number
  capacity?: number
  width?: number
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  capacity: 100,
  width: 150,
  height: 200
})

const fillHeight = computed(() => {
  const percentage = Math.min(100, Math.max(0, (props.level / props.capacity) * 100))
  return percentage
})
</script>

<template>
  <div class="tank-container">
    <div class="tank" :style="{ width: `${width}px`, height: `${height}px` }">
      <div class="water" :style="{ height: `${fillHeight}%` }"></div>
      <div class="level-text">{{ level.toFixed(1) }}L</div>
    </div>
    <div class="tank-label">{{ label }}</div>
  </div>
</template>

<style scoped>
.tank-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.tank {
  position: relative;
  border: 3px solid #333;
  border-radius: 8px;
  background: #f0f0f0;
  overflow: hidden;
}

.water {
  position: absolute;
  bottom: 0;
  width: 100%;
  background: linear-gradient(180deg, #4fc3f7 0%, #0288d1 100%);
  transition: height 0.5s ease;
}

.level-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: bold;
  font-size: 18px;
  color: #333;
  z-index: 10;
  text-shadow: 0 0 3px white;
}

.tank-label {
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  color: #555;
}
</style>
