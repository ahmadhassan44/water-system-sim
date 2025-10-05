<script setup lang="ts">
import { onMounted, onUnmounted, computed } from 'vue'
import { useThingsBoardStore } from './stores/ThingsBoardStore'
import WaterTank from './components/WaterTank.vue'
import WaterPump from './components/WaterPump.vue'
import FlowSensor from './components/FlowSensor.vue'
import WaterOutlet from './components/WaterOutlet.vue'
import ConnectionStatus from './components/ConnectionStatus.vue'

const store = useThingsBoardStore()

const undergroundLevel = computed(() => Number(store.devices.undergroundTank.data.level) || 0)
const overheadLevel = computed(() => Number(store.devices.overheadTank.data.level) || 0)
const pumpStatus = computed(() => Boolean(store.devices.waterPump.data.status))
const inflowRate = computed(() => Number(store.devices.inflow.data.flow) || 0)
const outflowRate = computed(() => Number(store.devices.outflow.data.flow) || 0)

const washbasin1Status = computed(() => Boolean(store.devices.washbasin1.data.status))
const washbasin1Flow = computed(() => Number(store.devices.washbasin1.data.flow) || 0)
const washbasin2Status = computed(() => Boolean(store.devices.washbasin2.data.status))
const washbasin2Flow = computed(() => Number(store.devices.washbasin2.data.flow) || 0)
const kitchenSinkStatus = computed(() => Boolean(store.devices.kitchenSink.data.status))
const kitchenSinkFlow = computed(() => Number(store.devices.kitchenSink.data.flow) || 0)
const showerStatus = computed(() => Boolean(store.devices.shower.data.status))
const showerFlow = computed(() => Number(store.devices.shower.data.flow) || 0)

const togglePump = () => {
  store.sendCommand('waterPump', { status: !pumpStatus.value })
}

const toggleWashbasin1 = () => {
  store.sendCommand('washbasin1', { status: !washbasin1Status.value })
}

const toggleWashbasin2 = () => {
  store.sendCommand('washbasin2', { status: !washbasin2Status.value })
}

const toggleKitchenSink = () => {
  store.sendCommand('kitchenSink', { status: !kitchenSinkStatus.value })
}

const toggleShower = () => {
  store.sendCommand('shower', { status: !showerStatus.value })
}

onMounted(() => {
  store.connect()
})

onUnmounted(() => {
  store.disconnect()
})
</script>

<template>
  <div class="water-system">
    <div class="header">
      <h1>Water System Simulation</h1>
      <ConnectionStatus />
    </div>

    <div class="system-diagram">
      <div class="left-section">
        <WaterPump :is-on="pumpStatus" @toggle="togglePump" />
        <WaterTank label="Underground Tank" :level="undergroundLevel" :capacity="1000" :height="180" />
      </div>

      <div class="center-section">
        <div class="pipe-vertical"></div>
      </div>

      <div class="right-section">
        <div class="overhead-area">
          <WaterTank label="Overhead Tank" :level="overheadLevel" :capacity="500" :width="120" :height="150" />

          <div class="sensors-group">
            <FlowSensor label="Tank Level" :flow="overheadLevel" />
            <FlowSensor label="In-flow" :flow="inflowRate" />
            <FlowSensor label="Out-flow" :flow="outflowRate" />
          </div>
        </div>

        <div class="outlets-area">
          <WaterOutlet
            label="Wash Basin 1"
            :is-on="washbasin1Status"
            :flow="washbasin1Flow"
            @toggle="toggleWashbasin1"
          />
          <WaterOutlet
            label="Wash Basin 2"
            :is-on="washbasin2Status"
            :flow="washbasin2Flow"
            @toggle="toggleWashbasin2"
          />
          <WaterOutlet
            label="Kitchen Sink"
            :is-on="kitchenSinkStatus"
            :flow="kitchenSinkFlow"
            @toggle="toggleKitchenSink"
          />
          <WaterOutlet
            label="Shower"
            :is-on="showerStatus"
            :flow="showerFlow"
            @toggle="toggleShower"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.water-system {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  max-width: 1200px;
  margin: 0 auto 40px;
  gap: 20px;
}

h1 {
  color: #2c3e50;
  margin: 0;
  flex: 1;
}

.system-diagram {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 100px 2fr;
  gap: 40px;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.left-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
}

.center-section {
  display: flex;
  justify-content: center;
  align-items: stretch;
}

.pipe-vertical {
  width: 8px;
  background: linear-gradient(180deg, #607d8b 0%, #37474f 100%);
  border-radius: 4px;
  position: relative;
}

.pipe-vertical::before,
.pipe-vertical::after {
  content: '';
  position: absolute;
  width: 12px;
  height: 12px;
  background: #455a64;
  border-radius: 50%;
  left: 50%;
  transform: translateX(-50%);
}

.pipe-vertical::before {
  top: -6px;
}

.pipe-vertical::after {
  bottom: -6px;
}

.right-section {
  display: flex;
  flex-direction: column;
  gap: 60px;
}

.overhead-area {
  display: flex;
  gap: 30px;
  align-items: flex-start;
}

.sensors-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.outlets-area {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  padding-left: 40px;
}
</style>
