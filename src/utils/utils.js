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
