<template>
  <el-container style="height: calc(100vh - 90px); border: 1px solid #eee" class="permission-list">
    <el-aside width="220px" style=" background-color: rgb(238, 241, 246)">
      <el-menu style="height: calc(100vh - 114px);">
        <template v-for="i in tableData">
          <sidebar :key="i.id" :item="i" @select="select" />
        </template>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <el-button type="primary" style="float: left; margin-top: 12px;" :disabled="!permission.includes('permission:add')" @click="handleAdd">新增</el-button>
        <span>{{ selectItem.meta ? selectItem.meta.title : '' }}</span>
      </el-header>

      <el-main>
        <el-table :data="permissionData">
          <el-table-column prop="name" label="标识" />
          <el-table-column prop="remark1" label="名称" />
          <el-table-column prop="remark2" label="描述" />
          <el-table-column prop="sort" label="排序" sortable />
          <el-table-column label="启用">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.enable"
                active-color="#13ce66"
                inactive-color="#aaa"
                :active-value="1"
                :inactive-value="0"
                @change="changeEnable(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" :disabled="!(permission.includes('permission:edit'))" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="danger" :disabled="!(permission.includes('permission:delete'))" @click="handleDel(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <item-modal ref="itemModal" :data="tableData" :permission-id="selectItem.permissionId" :current-pid="selectItem.id" @handleAdd="addModal" @handleUpd="updModal" @handleDel="delModal" />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import itemModal from './components/Permissionmodal'
import { getMenus } from '@/api/permission/menu'
import { getPermission, updatePermission, deletePermission } from '@/api/permission/list'
import { generateMenu } from '@/utils/utils'
import sidebar from './components/PermissionSidebar'
export default {
  components: {
    sidebar,
    itemModal
  },
  data() {
    return {
      selectItem: '',
      permissionData: [],
      loading: false,
      tableData: []
    }
  },
  computed: {
    ...mapGetters(['permission'])
  },
  watch: {
    selectItem: {
      handler(val) {
        if (val.leaf === 1) {
          this.getPermission({ ParentId: val.permissionId })
        }
      },
      deep: true
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleEdit(row) {
      this.$refs.itemModal.edit(row)
    },
    handleAdd(row) {
      this.$refs.itemModal.add()
    },
    handleDel(row) {
      this.$confirm('确认删除权限?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          deletePermission({ 'Id': row.id, 'Name': row.name }).then(() => {
            this.delModal(row)
          })
        })
        .catch(err => { console.error(err) })
    },
    delModal(row) {
      const index = this.permissionData.findIndex(_ => _.id === row.id)
      this.permissionData.splice(index, 1)
      this.success()
    },
    updModal(row) {
      const index = this.permissionData.findIndex(_ => _.id === row.id)
      this.permissionData.splice(index, 1, row)
      this.success()
    },
    addModal(row) {
      this.permissionData.push(row)
      this.success()
    },
    changeEnable(row) {
      updatePermission({
        'Id': row.id,
        'Enable': row.enable,
        'ParentId': row.permissionId,
        'SortNum': row.sort,
        'Remark1': '',
        'Remark2': '',
        'Name': row.name
      }).then(() => {
        this.success()
      }).catch(() => {
        if (row.enable) {
          row.enable = 0
        } else {
          row.enable = 1
        }
      })
    },
    getPermission(obj) {
      getPermission(obj).then(res => {
        this.permissionData = res.data.map(_ => {
          return {
            id: _.Id,
            enable: _.Enable,
            permissionId: _.ParentId,
            sort: _.SortNum,
            name: _.Name,
            remark1: _.Remark1,
            remark2: _.Remark2
          }
        })
      })
    },
    select(item) {
      this.selectItem = item
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
    // 获取列表
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
<style lang="scss">
.permission-list{
  .el-header {
    color: #333;
    line-height: 60px;
    box-shadow: 2px 2px 4px #ddd;
  }
  .el-aside {
    padding: 0;
    color: #333;
  }
}
</style>
