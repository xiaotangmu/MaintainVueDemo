// import parseTime, formatTime and set to filter
export { parseTime, formatTime } from '@/utils'

/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

/**
 * @param {number} time
 */
export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

/**
 * Number formatting
 * like 10000 => 10k
 * @param {number} num
 * @param {number} digits
 */
export function numberFormatter(num, digits) {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function toThousandFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

/**
 * Upper case first char
 * @param {String} string
 */
export function uppercaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function toMoney(num) {
  if (num) {
    if (isNaN(num)) {
      alert('金额中含有不能识别的字符')
      return
    }
    num = typeof num === 'string' ? parseFloat(num) : num // 判断是否是字符串如果是字符串转成数字
    num = num.toFixed(2) // 保留两位

    num = parseFloat(num) // 转成数字
    num = num.toLocaleString() // 转成金额显示模式
    // 判断是否有小数
    if (num.indexOf('.') === -1) {
      num = '￥' + num + '.00'
    } else {
      num = num.split('.')[1].length < 2 ? '￥' + num + '0' : '￥' + num
    }
    return num // 返回的是字符串23,245.12保留2位小数
  } else {
    return null
  }
}

export function formatDate(date, format = 'yyyy-MM-dd') {
  date = new Date(date)
  const yyyy = date.getFullYear()

  let mm = date.getMonth() + 1
  mm = mm < 10 ? '0' + mm : mm

  let dd = date.getDate()
  dd = dd < 10 ? '0' + dd : dd

  let hh = date.getHours()
  hh = hh < 10 ? '0' + hh : hh

  let minu = date.getMinutes()
  minu = minu < 10 ? '0' + minu : minu

  let ss = date.getSeconds()
  ss = ss < 10 ? '0' + ss : ss

  return format
    .replace('yyyy', yyyy)
    .replace('MM', mm)
    .replace('dd', dd)
    .replace('hh', hh)
    .replace('mm', minu)
    .replace('ss', ss)
}
