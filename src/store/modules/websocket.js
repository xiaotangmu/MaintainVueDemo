import * as signalR from '@aspnet/signalr'
const state = {
  msg: {
    system: [],
    user: {
      warning: []
    }
  },
  badge: {
    system: 0,
    user: {
      warning: 0
    }
  },
  ws: null
}

const mutations = {
  DEL_WARNING_READ: (state) => {
    const arr = state.msg.user.warning
    for (let i = arr.length - 1; i >= 0; i--) {
      if (arr[i].type === 1) {
        arr.splice(i, 1)
      }
    }
  },
  DEL_WARNING: (state, id) => {
    const arr = state.msg.user.warning
    const index = arr.findIndex(i => i.id === id)
    arr.splice(index, 1)
  },
  DEL_WARNING_BATCH: (state, target) => {
    const arr = state.msg.user.warning
    for (let i = arr.length - 1; i >= 0; i--) {
      if (target.includes(arr[i].id)) {
        arr.splice(i, 1)
      }
    }
  },
  READ_USER_WARNING: (state, id) => {
    const index = state.msg.user.warning.findIndex(i => i.id === id)
    state.msg.user.warning[index].type = 1
    state.badge.user.warning--
  },
  ALL_READ_USER_WARNING: (state) => {
    state.msg.user.warning.forEach(i => {
      i.type = 1
    })
    state.badge.user.warning = 0
  },
  SET_BADGE: (state, { type, count }) => {
    const arr = type.split('/')
    setData(state.badge, arr, count)
    const setData = (obj, arr, value) => {
      if (arr.length === 1) {
        if (value) {
          obj[arr[0]] -= value
        } else {
          obj[arr[0]] = 0
        }
      } else {
        setData(obj[arr[0]], arr.slice(1), value)
      }
    }
  },
  SET_MSG: (state, { type, msg }) => {
    if (type === 'system') {
      state.msg[type].push(msg)
    } else {
      const arr = msg.map(i => {
        i.content = JSON.parse(i.content)
        return i
      })
      arr.forEach(i => {
        state.msg[type].warning.push(i)
      })
      state.badge[type].warning = msg.reduce((total, item) => {
        return total + (item.type === 0 ? 1 : 0)
      }, 0)
    }
  },
  SET_WS: (state, ws) => {
    state.ws = ws
  },
  RESET_WS: (state) => {
    state.ws = null
    state.msg = {
      system: [],
      user: {
        warning: {
          read: [],
          notRead: []
        }
      }
    }
    state.badge = {
      system: 0,
      user: {
        warning: {
          read: 0,
          notRead: 0
        }
      }
    }
  }
}

const actions = {
  connect({ commit, dispatch }, username) {
    console.log('socket开始连接')
    commit('SET_WS', new signalR.HubConnectionBuilder()
      // .withUrl("https://localhost:8789/api/chatHub?username=xxx", { // 带参, 注意路径不能在普通路径下（api/v0.1/）
      .withUrl('https://test.grandpowertech.com:8789/api/chatHub?LoginName=' + username, {
      // .withUrl('https://localhost:8789/api/chatHub?LoginName=' + username, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .configureLogging(signalR.LogLevel.Information)
      .build())

    // ReceiveMessage 后台约定的接收方法
    state.ws.on('ReceiveMessage', (user, message) => {
      commit('SET_MSG', { user, type: 'system', msg: message })
      console.log('接收消息', { user, message })
    })

    // 这里为了push不报错，我就弄了一个默认值。
    state.ws.on('ReceiveCaller', (user, message) => {
      commit('SET_MSG', { user, type: 'user', msg: message })
      console.log('接收消息', { user, message })
    })
    state.ws.onclose(() => {
      commit('RESET_WS')
      console.log('重新连接')
      dispatch('connect', username)
    })
    state.ws.start()
  },
  reset({ commit }) {
    return new Promise((resolve) => {
      state.ws.invoke('Close')
      commit('RESET_WS')
      console.log('websocket断开，清除ws')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
