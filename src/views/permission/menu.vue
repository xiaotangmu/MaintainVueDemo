<template>
  <div style="padding: 20px;">
    <el-input v-model="search" style="width: 200px;margin-right: 15px;" placeholder="请输入名称" />
    <el-button type="primary" :loading="loading" @click="getList">查询</el-button>
    <el-button type="primary" @click="menuAdd">新增</el-button>
    <el-table
      style="margin-top: 20px;"
      :data="tableData"
      stripe
      row-key="name"
      :tree-props="{children: 'children'}"
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
      <el-table-column align="center" label="图标">
        <template slot-scope="scope">
          {{ scope.row.meta.icon }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="redirect" label="默认路径" />
      <el-table-column align="center" width="100" label="隐藏导航栏">
        <template slot-scope="scope">
          {{ scope.row.hidden }}
        </template>
      </el-table-column>
      <el-table-column align="center" width="80" label="不缓存">
        <template slot-scope="scope">
          {{ scope.row.meta.noCatch }}
        </template>
      </el-table-column>
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
    <menu-modal ref="menuModal" @handleAdd="handleAdd" @handleUpd="handleUpd" />
  </div>
</template>

<script>
import { getRoutes, delMenu } from '@/api/permission/menu'
import MenuModal from './components/MenuModal'
import { getParentById } from '@/utils/utils'
import { delEmpty, delObjByKey, addObjByKey } from '@/utils/utils'
export default {
  components: {
    MenuModal
  },
  data() {
    return {
      loading: false,
      tableData: [],
      search: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleAdd(key, value, obj) {
      if (value === 'Root') {
        this.tableData.push(obj)
      } else {
        addObjByKey(this.tableData, 'id', value, obj)
      }
      const arr = JSON.parse(JSON.stringify(this.tableData))
      this.tableData = arr
      this.success()
    },
    handleUpd(key, value, obj) {
      delObjByKey(this.tableData, 'id', obj.id)
      if (obj.pid === 'Root') {
        this.tableData.push(obj)
      } else {
        addObjByKey(this.tableData, 'id', obj.pid, obj)
      }
      this.success()
    },
    menuDelete(index, row) {
      this.$confirm(`确认删除${row.meta.title}?`)
        .then(_ => {
          this.delMenu(row)
        })
        .catch(_ => {})
    },
    async delMenu(row) {
      await delMenu({ id: row.id })
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
      getRoutes(delEmpty({ name: this.search })).then(res => {
        this.tableData = res.data
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
