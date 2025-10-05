import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useThingsBoardStore, type DeviceType } from './ThingsBoardStore'

export const useWaterSimulation = defineStore('waterSimulation', () => {
  const tbStore = useThingsBoardStore()
  const isRunning = ref(false)

  const undergroundTankLevel = ref(500)
  const overheadTankLevel = ref(250)
  const pumpOn = ref(false)

  const washbasin1On = ref(false)
  const washbasin2On = ref(false)
  const kitchenSinkOn = ref(false)
  const showerOn = ref(false)

  const UNDERGROUND_CAPACITY = 1000
  const OVERHEAD_CAPACITY = 500
  const PUMP_FLOW_RATE = 50
  const WASHBASIN_FLOW_RATE = 8
  const KITCHEN_SINK_FLOW_RATE = 10
  const SHOWER_FLOW_RATE = 15

  let simulationInterval: number | null = null

  const publishTelemetry = (deviceType: DeviceType, data: Record<string, any>) => {
    tbStore.sendTelemetry(deviceType, data)
  }

  const updateSimulation = () => {
    let inflowRate = 0
    let outflowRate = 0

    if (pumpOn.value && undergroundTankLevel.value > 0 && overheadTankLevel.value < OVERHEAD_CAPACITY) {
      const pumpAmount = Math.min(
        PUMP_FLOW_RATE / 60,
        undergroundTankLevel.value,
        OVERHEAD_CAPACITY - overheadTankLevel.value
      )

      undergroundTankLevel.value -= pumpAmount
      overheadTankLevel.value += pumpAmount
      inflowRate = PUMP_FLOW_RATE
    }

    if (washbasin1On.value && overheadTankLevel.value > 0) {
      const consumeAmount = Math.min(WASHBASIN_FLOW_RATE / 60, overheadTankLevel.value)
      overheadTankLevel.value -= consumeAmount
      outflowRate += WASHBASIN_FLOW_RATE
      publishTelemetry('washbasin1', {
        status: true,
        flow: WASHBASIN_FLOW_RATE
      })
    } else {
      publishTelemetry('washbasin1', {
        status: false,
        flow: 0
      })
    }

    if (washbasin2On.value && overheadTankLevel.value > 0) {
      const consumeAmount = Math.min(WASHBASIN_FLOW_RATE / 60, overheadTankLevel.value)
      overheadTankLevel.value -= consumeAmount
      outflowRate += WASHBASIN_FLOW_RATE
      publishTelemetry('washbasin2', {
        status: true,
        flow: WASHBASIN_FLOW_RATE
      })
    } else {
      publishTelemetry('washbasin2', {
        status: false,
        flow: 0
      })
    }

    if (kitchenSinkOn.value && overheadTankLevel.value > 0) {
      const consumeAmount = Math.min(KITCHEN_SINK_FLOW_RATE / 60, overheadTankLevel.value)
      overheadTankLevel.value -= consumeAmount
      outflowRate += KITCHEN_SINK_FLOW_RATE
      publishTelemetry('kitchenSink', {
        status: true,
        flow: KITCHEN_SINK_FLOW_RATE
      })
    } else {
      publishTelemetry('kitchenSink', {
        status: false,
        flow: 0
      })
    }

    if (showerOn.value && overheadTankLevel.value > 0) {
      const consumeAmount = Math.min(SHOWER_FLOW_RATE / 60, overheadTankLevel.value)
      overheadTankLevel.value -= consumeAmount
      outflowRate += SHOWER_FLOW_RATE
      publishTelemetry('shower', {
        status: true,
        flow: SHOWER_FLOW_RATE
      })
    } else {
      publishTelemetry('shower', {
        status: false,
        flow: 0
      })
    }

    publishTelemetry('undergroundTank', {
      level: Math.round(undergroundTankLevel.value)
    })

    publishTelemetry('overheadTank', {
      level: Math.round(overheadTankLevel.value)
    })

    publishTelemetry('waterPump', {
      status: pumpOn.value
    })

    publishTelemetry('inflow', {
      flow: Math.round(inflowRate * 100) / 100
    })

    publishTelemetry('outflow', {
      flow: Math.round(outflowRate * 100) / 100
    })
  }

  const startSimulation = () => {
    if (isRunning.value) return

    isRunning.value = true

    simulationInterval = window.setInterval(() => {
      updateSimulation()
    }, 1000)
  }

  const stopSimulation = () => {
    if (!isRunning.value) return

    isRunning.value = false

    if (simulationInterval) {
      clearInterval(simulationInterval)
      simulationInterval = null
    }
  }

  const togglePump = () => {
    pumpOn.value = !pumpOn.value
  }

  const toggleWashbasin1 = () => {
    washbasin1On.value = !washbasin1On.value
  }

  const toggleWashbasin2 = () => {
    washbasin2On.value = !washbasin2On.value
  }

  const toggleKitchenSink = () => {
    kitchenSinkOn.value = !kitchenSinkOn.value
  }

  const toggleShower = () => {
    showerOn.value = !showerOn.value
  }

  return {
    isRunning,
    undergroundTankLevel,
    overheadTankLevel,
    pumpOn,
    washbasin1On,
    washbasin2On,
    kitchenSinkOn,
    showerOn,
    startSimulation,
    stopSimulation,
    togglePump,
    toggleWashbasin1,
    toggleWashbasin2,
    toggleKitchenSink,
    toggleShower
  }
})
