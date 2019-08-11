import { parseStringifiedArray, stringifyArray } from '../../utils/array-utils.js'

export function createWS (name, address, protocols, options) {
  return {
    effectType: 'create-ws',
    name,
    address,
    protocols,
    options
  }
}

export function terminateWS (name) {
  return {
    effectType: 'terminate-ws',
    name
  }
}

export function wsPingSent (name) {
  return {
    type: 'ws-ping-sent',
    name
  }
}

export function sendWS (name, data) {
  return {
    effectType: 'send-ws',
    name,
    data
  }
}

export function sendWSPing (name, data, mask) {
  return {
    effectType: 'send-ws-ping',
    name,
    data,
    mask
  }
}

export function sendWSPong (name, data, mask) {
  return {
    effectType: 'send-ws-pong',
    name,
    data,
    mask
  }
}

export function wsClose (name, code, reason) {
  return {
    type: 'ws-close',
    name,
    code,
    reason
  }
}

export function wsUpgrade (name, request) {
  return {
    type: 'ws-upgrade',
    name,
    request
  }
}

export function wsOpen (name) {
  return {
    type: 'ws-open',
    name
  }
}

export function wsError (name, error) {
  return {
    type: 'ws-error',
    name,
    error
  }
}

export function wsMessage (name, data) {
  return {
    type: 'ws-message',
    name,
    data
  }
}

export function wsPing (name, data) {
  return {
    type: 'ws-ping',
    name,
    data
  }
}

export function wsPong (name, data) {
  return {
    type: 'ws-pong',
    name,
    data
  }
}

export function wsUnexpectedResponse (name, request, response) {
  return {
    type: 'ws-unexpected-response',
    name,
    request,
    response
  }
}

export function withWs (dispatch) {
  const webSockets = {}
  return (effect) => {
    switch (effect.effectType) {
      case 'create-ws':
        var ws = new WebSocket(effect.address)
        var name = stringifyArray(effect.name)
        webSockets[name] = ws
        ws.onopen = () => dispatch(wsOpen(effect.name))
        ws.onmessage = (data) => dispatch(wsMessage(effect.name, data))
        ws.onerror = (err) => dispatch(wsError(effect.name, err))
        ws.onclose = (e) => dispatch(wsClose(effect.name, e.code, e.reason))
        break

      case 'send-ws':
        var ws = webSockets[stringifyArray(effect.name)]
        if (ws) {
          ws.send(effect.data)
        } else {
          console.error(`Unable to send message to websocket ${stringifyArray(effect.name)}`)
        }
        break

      case 'terminate-ws':
        var name = stringifyArray(effect.name)
        var ws = webSockets[name]
        if (ws) {
          const listeners = ['message', 'error', 'close', 'ping', 'pong', 'unexpected-response', 'upgrade']
          listeners.map((l) => ws.removeEventListener(l))
          ws.terminate()
          delete webSockets[name]
        } else {
          console.error(`Unable to terminate websocket ${name}`)
        }
        break

      case 'send-ws-ping':
        var name = stringifyArray(effect.name)
        var ws = webSockets[name]
        if (ws) {
          ws.ping(effect.name, effect.data, effect.mask, dispatch(wsPingSent(effect.name)))
        }
        break

      case 'send-ws-pong':
        var name = stringifyArray(effect.name)
        var ws = webSockets[name]
        if (ws) {
          ws.pong(effect.name, effect.data, effect.mask)
        }
        break
    }
  }
}
