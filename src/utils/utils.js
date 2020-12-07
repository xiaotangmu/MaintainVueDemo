export function formatDate(date, format = 'yyyy-MM-dd') {
  date = new Date(date)
  const obj = {
    'yyyy': date.getFullYear(),
    'MM': date.getMonth() + 1,
    'dd': date.getDate(),
    'hh': date.getHours(),
    'mm': date.getMinutes(),
    'ss': date.getSeconds()
  }

  return format.replace(/[yMdhms]+/g, (key) => {
    return obj[key].toString().padStart(2, '0')
  })
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
  arr = JSON.parse(JSON.stringify(arr))
  return arr.filter(i => i[key] !== value).map(j => {
    if (j.children) {
      j.children = delByKey(j.children, key, value)
    }
    return j
  })
}

export function getParentById(id, arr, parentId = 'Root') {
  let pId = 'Root'
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id === id) {
      return parentId
    }

    if (arr[i].children) {
      pId = getParentById(id, arr[i].children, arr[i].id)
      if (pId !== 'Root') {
        return pId
      }
    }
  }
  return pId
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

// 生成树
export function getTreeData(arr, pid) {
  pid = pid || '0'
  let target = arr.filter(i => {
    i.pid === pid
  })
  const filterArr = arr.filter(i => {
    i.pid !== pid
  })
  target = target.map(i => {
    i.children = getTreeData(filterArr, i.id)
    return i
  })
  return target
}

export function delObjByKey(arr, key, value) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] === value) {
      arr.splice(i, 1)
      return {
        isOver: true,
        arr
      }
    } else {
      if (arr[i].children) {
        const item = delObjByKey(arr[i].children, key, value)
        arr[i].children = item.arr
        if (item.isOver) {
          return {
            isOver: true,
            arr
          }
        }
      }
    }
  }
  return {
    isOver: false,
    arr
  }
}

export function addObjByKey(arr, key, value, obj) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] === value) {
      arr[i].children = arr[i].children || []
      arr[i].children.push(obj)
      return {
        isOver: true,
        arr
      }
    } else {
      if (arr[i].children) {
        const item = addObjByKey(arr[i].children, key, value, obj)
        arr[i].children = item.arr
        if (item.isOver) {
          return {
            isOver: true,
            arr
          }
        }
      }
    }
  }
  return {
    isOver: false,
    arr
  }
}

export function updObjByKey(arr, key, value, obj) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] === value) {
      Object.keys(obj).forEach(_ => {
        arr[i][_] = obj[_]
      })
      return {
        isOver: true,
        arr
      }
    } else {
      if (arr[i].children) {
        const item = updObjByKey(arr[i].children, key, value, obj)
        arr[i].children = item.arr
        if (item.isOver) {
          return {
            isOver: true,
            arr
          }
        }
      }
    }
  }
  return {
    isOver: false,
    arr
  }
}

export function generateMenu(arr) {
  return arr.map(i => {
    let list = []
    if (i.PermissionList) {
      list = i.PermissionList.map(_ => {
        return {
          id: _.Id,
          permission: true,
          title: _.Remark1 + '(pItem)'
        }
      })
    }
    return {
      id: i.Id,
      name: i.Code || '',
      sort: i.SortNum,
      pid: i.ParentId,
      path: i.Path,
      component: i.Component,
      meta: {
        icon: i.Icon,
        title: i.Title,
        noCatch: i.NoCache
      },
      redirect: i.Redirect,
      hidden: i.Hidden,
      level: i.Level,
      leaf: i.Leaf,
      children: generateMenu(i.Children),
      permissionList: list,
      permissionId: i.PermissionId
    }
  })
}

export function generateMenuApi(arr) {
  return arr.map(i => {
    let list = []
    if (i.permissionList) {
      list = i.permissionList.map(_ => {
        return {
          PermissionId: _.id
        }
      })
    }
    const obj = {
      PermissionList: list,
      Children: generateMenuApi(i.children),
      PermissionId: i.permissionId
    }
    return obj
  })
}
