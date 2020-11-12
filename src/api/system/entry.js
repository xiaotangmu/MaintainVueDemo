import request from '@/utils/request'
import { url } from '../proxy'

export function getEntryList(params) {
  return request({
    url: url + '/Entry/GetListPageBySearch',
    method: 'get',
    params
  })
}
export function addEntry(data) {
  return request({
    url: url + '/Entry/Add',
    method: 'post',
    data
  })
}
export function delEntry(data) {
  return request({
    url: url + '/Entry/Delete',
    method: 'delete',
    params: data
  })
}
export function delEntryBatch(data) {
  return request({
    url: url + '/Entry/DeleteBatch',
    method: 'delete',
    data
  })
}
export function updEntry(data) {
  return request({
    url: url + '/Entry/Update',
    method: 'post',
    data
  })
}
export function remarkEntry(data) {
  return request({
    url: url + '/Entry/RemarkEntry',
    method: 'post',
    data
  })
}
