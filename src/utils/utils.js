export function formatDate(date, format = 'yyyy-MM-dd') {
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

export function delEmpty(obj) {
  return Object.keys(obj)
    .filter(i => obj[i] !== '' && obj[i] !== null)
    .reduce((total, i) => {
      total[i] = obj[i]
      return total
    }, {})
}

export function delByKey(arr, key, value) {
  return arr.filter(i => i[key] !== value).map(j => {
    if (j.children) {
      j.children = delByKey(j.children, key, value)
    }
    return j
  })
}

export function getParentByName(name, arr, parentName) {
  var pName = parentName || 'Root'
  arr.forEach(i => {
    if (i.name === name) {
      return pName
    } else {
      if (i.children) {
        pName = getParentByName(name, i.children, i.name)
      }
    }
  })
  return pName
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
