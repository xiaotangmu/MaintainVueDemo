import request from '@/utils/request'
import { url } from '../proxy'

export function markRead(data) {
  return request({
    url: url + '/Notification/MarkRead',
    method: 'post',
    data
  })
}
export function markReadAll(data) {
  return request({
    url: url + '/Notification/MarkReadAll',
    method: 'post',
    data
  })
}
export function delReadAll(params) {
  return request({
    url: url + '/Notification/DeleteReadAll',
    method: 'delete',
    params
  })
}
export function delRead(params) {
  return request({
    url: url + '/Notification/Delete',
    method: 'delete',
    params
  })
}
export function delReadBatch(data) {
  return request({
    url: url + '/Notification/DeleteBatch',
    method: 'delete',
    data
  })
}

