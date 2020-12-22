
export function success(that, message) {
  that.$message.success((message !== undefined && message !== null && message !== '') ? message : '操作成功')
}
export function message(that, message, type) {
  that.$message({
    type: (type !== undefined && type !== null && type !== '') ? type : 'success',
    message: (message !== undefined && message !== null && message !== '') ? message : '操作成功'
  })
}
export function messageAndSetTime(that, message, time, type) {
  that.$message({
    type: (type !== undefined && type !== null && type !== '') ? type : 'success',
    message: (message !== undefined && message !== null && message !== '') ? message : '操作成功',
    duration: (time !== undefined && time !== '' && time > 0) ? time : 5000 // 单位毫秒
  })
}
