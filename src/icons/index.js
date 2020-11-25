import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// register globally
Vue.component('svg-icon', SvgIcon)

let rqc
const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => {
  rqc = requireContext.keys()
  return rqc.map(requireContext)
}
requireAll(req)
export const iconArr = rqc.map(i => {
  return i.replace(/(^.\/)|(.svg$)/g, '')
})
