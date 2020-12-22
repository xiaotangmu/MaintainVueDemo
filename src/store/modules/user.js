import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken, getUsername, setUsername, removeUsername } from '@/utils/auth'

const state = {
  token: getToken(),
  name: '',
  avatar: 'img/taxi2.png',
  introduction: '',
  routes: null,
  role: '',
  username: getUsername()
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_USERNAME: (state, username) => {
    state.username = username
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROUTES: (state, routes) => {
    state.routes = routes
  },
  SET_ROLE: (state, role) => {
    state.role = role
  }
}

const actions = {
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ LoginName: username.trim(), Password: password }).then(response => {
        const { token } = response
        commit('SET_TOKEN', token)
        commit('SET_USERNAME', username.trim())
        setToken(token)
        setUsername(username.trim())
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo('admin-token').then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { routes, name, avatar, introduction, role } = data

        if (!routes && routes !== []) {
          reject('getInfo: routes must be a array!')
        }

        commit('SET_ROUTES', routes)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        commit('SET_ROLE', role)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  logout({ commit, state, dispatch }) {
    return new Promise(reject => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROUTES', null)
        removeToken()
        removeUsername()
        dispatch('tagsView/delAllViews', null, { root: true })
        dispatch('websocket/reset', null, { root: true }).then(() => {
          location.reload()
        })
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
