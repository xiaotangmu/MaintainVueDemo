import request from '@/utils/request'
import { url } from '../proxy'

export function getAppointmentList(params) {
  return request({
    url: url + '/Appointment/GetListPageBySearch',
    method: 'get',
    params
  })
}
export function addAppointment(data) {
  return request({
    url: url + '/Appointment/Add',
    method: 'post',
    data
  })
}
export function delAppointment(data) {
  return request({
    url: url + '/Appointment/Delete',
    method: 'delete',
    params: data
  })
}
export function updAppointment(data) {
  return request({
    url: url + '/Appointment/Update',
    method: 'post',
    data
  })
}
