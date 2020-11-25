<template>
  <div style="padding: 20px;">
    <el-input v-model="search" style="width: 200px;margin-right: 15px;" placeholder="请输入名称" />
    <el-button type="primary" @click="menuAdd">新增</el-button>
    <el-table
      style="margin-top: 20px;"
      :data="tableDataFilter"
      row-key="id"
      :tree-props="{children: 'children'}"
      :row-style="rowStyle"
      @sort-change="sortChange"
    >
      <el-table-column prop="name" label="名称">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="path" label="路径" />
      <el-table-column align="center" prop="component" label="组件" />
      <el-table-column align="center" label="标题">
        <template slot-scope="scope">
          {{ scope.row.meta.title }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="类型">
        <template slot-scope="scope">
          {{ scope.row.leaf === 0 ? "目录" : "菜单" }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="图标">
        <template slot-scope="scope">
          {{ scope.row.meta.icon }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="redirect" label="默认路径" />
      <el-table-column
        align="center"
        width="100"
        label="隐藏导航栏"
        prop="hidden"
        :filters="[{ text: '隐藏', value: true }, { text: '显示(默认)', value: false }]"
        :filter-method="filterHandler"
      >
        <template slot-scope="scope">
          {{ scope.row.hidden ? "隐藏" : "显示(默认)" }}
        </template>
      </el-table-column>
      <el-table-column align="center" width="80" label="缓存">
        <template slot-scope="scope">
          {{ scope.row.meta.noCatch === 0 ? "缓存" : "不缓存(默认)" }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="sort" label="排序" sortable />
      <el-table-column
        align="center"
        label="操作"
        width="200"
      >
        <template slot-scope="scope">
          <el-button
            @click="menuEdit(scope.$index, scope.row)"
          >编辑</el-button>
          <el-button
            type="danger"
            @click="menuDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <menu-modal ref="menuModal" :data="tableData" @handleAdd="handleAdd" @handleUpd="handleUpd" />
  </div>
</template>

<script>
import { delMenu, getMenus } from '@/api/permission/menu'
import MenuModal from './components/MenuModal'
import { getParentById } from '@/utils/utils'
import { delObjByKey, addObjByKey, updObjByKey, generateMenu } from '@/utils/utils'
export default {
  components: {
    MenuModal
  },
  data() {
    return {
      loading: false,
      tableData: [],
      search: '',
      sort: {},
      colorList: ['ffffff', 'f7f7f7', 'efefef', 'e7e7e7', 'dfdfdf', 'd7d7d7', 'cfcfcf', 'c7c7c7', 'bfbfbf']
    }
  },
  computed: {
    // 是否过滤
    tableDataFilter() {
      if (this.search) {
        return this.filterName(JSON.parse(JSON.stringify(this.tableData)), this.search)
      }
      return this.tableData
    }
  },
  created() {
    this.getList()
  },
  methods: {
    rowStyle(row) {
      const i = row.row.level % 9
      return {
        'background-color': '#' + this.colorList[i]
      }
    },
    filterHandler(value, row, column) {
      const property = column['property']
      if (!value) {
        return row[property] === value || row[property] === ''
      }
      return row[property] === value
    },
    // 过滤arr,name键值中存在key的
    filterName(arr, key) {
      return arr.filter(_ => this.hasFilter(_, key)).map(_ => {
        if (_.children) {
          _.children = this.filterName(_.children, key)
        }
        return _
      })
    },
    // obj的键值或者子对象键值中包含key
    hasFilter(obj, key) {
      if (obj.name.indexOf(key) !== -1 || obj.meta.title.indexOf(key) !== -1) return true
      else if (obj.children) {
        return obj.children.some(_ => this.hasFilter(_, key))
      } else return false
    },
    // 根据参数排序列表
    sortChange(node) {
      let i = ''
      const { prop, order } = node
      if (order === 'ascending') {
        i = 1
      } else if (order === 'descending') {
        i = -1
      } else return
      this.sort = { prop, i }
      this.tableData.forEach(_ => {
        if (_.children) {
          this.sortData(_.children, prop, i)
        }
      })
    },
    // 递归排序
    sortData(arr, key, i) {
      arr.sort((a, b) => (a[key] - b[key]) * i)
      arr.forEach(_ => {
        if (_.children) {
          this.sortData(_.children, key, i)
        }
      })
    },
    // 增加节点
    handleAdd(key, value, obj) {
      if (value === '0') {
        this.tableData.push(obj)
      } else {
        addObjByKey(this.tableData, 'id', value, obj)
      }
      this.reSort()
    },
    // 增删改后排序
    reSort() {
      const arr = JSON.parse(JSON.stringify(this.tableData))
      this.tableData = arr
      this.tableData.forEach(_ => {
        if (_.children) {
          this.sortData(_.children, this.sort.prop, this.sort.i)
        }
      })
      this.success()
    },
    handleUpd(key, value, obj, change) {
      // 未更新父节点
      if (!change) {
        updObjByKey(this.tableData, 'id', obj.id, obj)
        this.reSort()
        return
      }

      // 父节点改变
      delObjByKey(this.tableData, 'id', obj.id)
      if (obj.pid === '0') {
        this.tableData.push(obj)
      } else {
        addObjByKey(this.tableData, 'id', obj.pid, obj)
      }
      this.reSort()
    },
    menuDelete(index, row) {
      this.$confirm(`确认删除${row.meta.title}?`)
        .then(_ => {
          this.delMenu(row)
        })
        .catch(_ => {})
    },
    async delMenu(row) {
      await delMenu({ Id: row.id, Title: row.meta.title, Level: row.level })
      delObjByKey(this.tableData, 'id', row.id)
      this.success()
    },
    menuAdd() {
      this.$refs.menuModal.add()
    },
    menuEdit(index, row) {
      const pid = row.pid || getParentById(row.id, this.tableData)
      this.$refs.menuModal.edit(row, pid)
    },
    opeModal() {
      this.getList()
    },
    getList() {
      this.loading = true
      getMenus({ HasPermission: 0 }).then(res => {
        const data = generateMenu(res.data)
        this.tableData = data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    success() {
      this.$message({
        type: 'success',
        message: '操作成功'
      })
    }
  }
}
</script>
