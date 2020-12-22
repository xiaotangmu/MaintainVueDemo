import request from '@/utils/request'
import { url } from '../proxy'

// 获取车型
export function getCarType() {
  return request({
    url: url + '/DataDict/GetChildrenByTypeCode',
    method: 'get',
    params: {
      TypeCode: 'CarType'
    }
  })
}
// 获取设备列表
export function getEquipmentList() {
  return request({
    url: url + '/DataDict/GetChildrenByTypeCode',
    method: 'get',
    params: {
      TypeCode: 'Equipment'
    }
  })
}
