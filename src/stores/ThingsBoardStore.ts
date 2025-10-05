import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface DeviceData {
  [key: string]: unknown
}

interface DeviceState {
  connected: boolean
  data: DeviceData
}

export type DeviceType =
  | 'washbasin1'
  | 'washbasin2'
  | 'kitchenSink'
  | 'shower'
  | 'inflow'
  | 'outflow'
  | 'waterPump'
  | 'undergroundTank'
  | 'overheadTank'

interface SubscribeCommand {
  tsSubCmds: Array<{
    entityType: string
    entityId: string
    scope: string
    cmdId: number
  }>
}

export const useThingsBoardStore = defineStore('thingsboard', () => {
  const devices = ref<Record<DeviceType, DeviceState>>({
    washbasin1: { connected: false, data: {} },
    washbasin2: { connected: false, data: {} },
    kitchenSink: { connected: false, data: {} },
    shower: { connected: false, data: {} },
    inflow: { connected: false, data: {} },
    outflow: { connected: false, data: {} },
    waterPump: { connected: false, data: {} },
    undergroundTank: { connected: false, data: {} },
    overheadTank: { connected: false, data: {} }
  })

  let ws: WebSocket | null = null
  const subscriptionMap = new Map<number, DeviceType>()

  const token = import.meta.env.VITE_TB_TOKEN
  const wsUrl = import.meta.env.VITE_TB_WS_URL

  const deviceIds: Record<DeviceType, string> = {
    washbasin1: import.meta.env.VITE_WASHBASIN_1_ID,
    washbasin2: import.meta.env.VITE_WASHBASIN_2_ID,
    kitchenSink: import.meta.env.VITE_KITCHEN_SINK_ID,
    shower: import.meta.env.VITE_SHOWER_ID,
    inflow: import.meta.env.VITE_INFLOW_ID,
    outflow: import.meta.env.VITE_OUTFLOW_ID,
    waterPump: import.meta.env.VITE_WATER_PUMP_ID,
    undergroundTank: import.meta.env.VITE_UNDERGROUND_TANK_ID,
    overheadTank: import.meta.env.VITE_OVERHEAD_TANK_ID
  }

  const wsEndpoint = computed(() => `${wsUrl}?token=${token}`)

  const connect = () => {
    ws = new WebSocket(wsEndpoint.value)

    ws.onopen = () => {
      subscribeAll()
    }

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data)
      updateDeviceData(message)
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    ws.onclose = () => {
      Object.keys(devices.value).forEach((key) => {
        devices.value[key as DeviceType].connected = false
      })
    }
  }

  const subscribeAll = () => {
    if (!ws) return

    let cmdId = 1

    Object.entries(deviceIds).forEach(([deviceType, deviceId]) => {
      if (deviceId) {
        const command: SubscribeCommand = {
          tsSubCmds: [{
            entityType: 'DEVICE',
            entityId: deviceId,
            scope: 'LATEST_TELEMETRY',
            cmdId
          }]
        }

        subscriptionMap.set(cmdId, deviceType as DeviceType)
        devices.value[deviceType as DeviceType].connected = true

        ws?.send(JSON.stringify(command))
        cmdId++
      }
    })
  }

  const updateDeviceData = (message: any) => {
    if (message.subscriptionId !== undefined) {
      const deviceType = subscriptionMap.get(message.subscriptionId)
      if (deviceType && message.data) {
        const telemetryData: DeviceData = {}
        Object.entries(message.data).forEach(([key, valueArray]) => {
          if (Array.isArray(valueArray) && valueArray.length > 0) {
            telemetryData[key] = valueArray[0][1]
          }
        })
        devices.value[deviceType].data = { ...devices.value[deviceType].data, ...telemetryData }
      }
    }
  }

  const sendCommand = (deviceType: DeviceType, command: Record<string, any>) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) return

    const deviceId = deviceIds[deviceType]
    if (!deviceId) return

    const rpcCommand = {
      method: 'setDeviceState',
      params: command
    }

    fetch(`http://localhost:8080/api/plugins/rpc/twoway/${deviceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(rpcCommand)
    }).catch(err => console.error('RPC error:', err))
  }

  const sendTelemetry = (deviceType: DeviceType, telemetry: Record<string, any>) => {
    const deviceId = deviceIds[deviceType]
    if (!deviceId) return

    fetch(`http://localhost:8080/api/plugins/telemetry/DEVICE/${deviceId}/timeseries/ANY`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(telemetry)
    }).catch(err => console.error('Telemetry error:', err))
  }

  const disconnect = () => {
    if (ws) {
      ws.close()
      ws = null
    }
    subscriptionMap.clear()
  }

  return {
    devices,
    connect,
    disconnect,
    sendCommand,
    sendTelemetry
  }
})
