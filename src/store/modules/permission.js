import { constantRoutes } from '@/router'
// import { exampleRoutes } from '@/router/case/index'
import { cpn } from '@/config/components'

function getRouter(routes) {
  return routes.map(_ => {
    const obj = {}
    Object.keys(_).forEach(i => {
      if (i !== 'children') {
        obj[i] = _[i]
      } else {
        obj[i] = getRouter(_[i])
      }
    })
    obj.component = cpn[obj.component]
    return obj
  })
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_ROLE: (state, role) => {
    state.role = role
  }
}

const actions = {
  generateRoutes({ commit }, routes) {
    return new Promise(resolve => {
      const asyncRoutes = getRouter(routes)
      // const accessedRoutes = exampleRoutes.concat(asyncRoutes) || []
      const accessedRoutes = asyncRoutes || []
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
