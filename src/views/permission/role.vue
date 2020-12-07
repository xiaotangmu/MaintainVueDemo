<template>
  <div class="app-container">
    <el-input v-model="search.SearchStr" placeholder="模糊查询" style="width: 350px;">
      <el-select slot="prepend" v-model="search.Enable" placeholder="请选择" style="width: 80px;">
        <el-option v-for="i in options" :key="i.value" :value="i.value" :label="i.label" />
      </el-select>
      <el-button slot="append" type="primary" icon="el-icon-search" @click="getRoles()" />
    </el-input>
    <el-button type="primary" :disabled="!(permission.includes('role:add'))" @click="handleAddRole">新增</el-button>

    <el-table :data="rolesList" style="width: 100%;margin-top:30px;" stripe>
      <el-table-column align="center" label="角色标识" width="220">
        <template slot-scope="scope">
          {{ scope.row.flag }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色名称" width="220">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="角色描述">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
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
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" :disabled="!(permission.includes('role:edit'))" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="danger" :disabled="!(permission.includes('role:delete'))" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="text-align: center;margin-top: 10px;"
      :current-page="search.PageIndex"
      :page-sizes="[10, 15, 20, 50]"
      :page-size="search.PageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="getRoles"
      @current-change="getRoles"
    />

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑角色':'新增角色'">
      <el-form ref="ruleForm" :model="role" :rules="rules" label-width="80px">
        <el-form-item label="角色标识" prop="flag">
          <el-input v-model="role.flag" placeholder="角色标识" />
        </el-form-item>
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="role.name" placeholder="角色名称" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input
            v-model="role.description"
            :autosize="{ minRows: 4, maxRows: 8}"
            type="textarea"
            placeholder="角色描述"
          />
        </el-form-item>
        <el-form-item label="状态" prop="enable">
          <el-select v-model="role.enable">
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="菜单/权限">
          <el-tree
            v-if="dialogVisible"
            ref="tree"
            :check-strictly="checkStrictly"
            :data="routesData"
            :props="defaultProps"
            show-checkbox
            node-key="id"
            class="permission-tree"
            :default-expanded-keys="expandedArr"
            @check="nodeClick"
          >
            <span slot-scope="{ node }">
              <span v-if="/\(pItem\)$/.test(node.label)">
                {{ node.label.replace(/\(pItem\)$/, '') }}
                <el-tag size="mini" type="success">子权限</el-tag>
              </span>
              <span v-else>
                {{ node.label }}
              </span>
              <span v-if="!node.isLeaf">
                <el-button
                  type="text"
                  size="mini"
                  style="margin-left: 10px;"
                  @click.stop="() => handleNodeClick(node)"
                >
                  全选
                </el-button>
              </span>
            </span>
          </el-tree>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="submit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { deepClone } from '@/utils'
import { getRoles, addRole, deleteRole, updateRole, enableRole } from '@/api/permission/role'
import { generateMenu, delEmpty, generateMenuApi } from '@/utils/utils'
import { getMenus } from '@/api/permission/menu'

const defaultRole = {
  key: '',
  flag: '',
  name: '',
  enable: 1,
  description: '',
  routes: []
}

export default {
  data() {
    return {
      total: 0,
      search: {
        SearchStr: '',
        Enable: -1,
        PageIndex: 1,
        PageSize: 10
      },
      options: [
        { label: '启用',
          value: 1
        },
        { label: '禁用',
          value: 0
        },
        { label: '全部',
          value: -1
        }
      ],
      expandedArr: [],
      role: Object.assign({}, defaultRole),
      routes: [],
      rolesList: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: true,
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      rules: {
        flag: [{ required: true, message: '请输入角色标识', trigger: 'blur' }],
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        enable: [{ required: true, message: '请选择角色状态', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters(['permission']),
    routesData() {
      return this.routes
    }
  },
  created() {
    this.getRoutes()
    this.getRoles()
  },
  methods: {
    handleNodeClick(node) {
      this.$refs.tree.setChecked(node.data.id, !node.checked)
      this.checkedChild(node, node.checked)
    },
    checkedChild(node, bool) {
      if (node.childNodes) {
        node.childNodes.forEach(i => {
          this.$refs.tree.setChecked(i.data.id, bool)
          this.checkedChild(i, bool)
        })
      }
    },
    changeEnable(row) {
      enableRole({
        Id: row.key,
        Name: row.flag,
        Enable: row.enable
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
    nodeClick(data) {
      const node = this.$refs.tree.getNode(data.id)
      this.childNodesChange(node)
      this.parentNodesChange(node)
    },
    childNodesChange(node) {
      if (!node.checked) {
        if (node.childNodes) {
          node.childNodes.forEach(i => {
            this.$refs.tree.setChecked(i.data.id, false)
            this.childNodesChange(i)
          })
        }
      }
    },
    parentNodesChange(node) {
      if (node.checked) {
        if (node.parent) {
          this.$refs.tree.setChecked(node.parent.data.id, true)
          this.parentNodesChange(node.parent)
        }
      }
    },
    submit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.confirmRole()
        }
      })
    },
    async getRoutes() {
      const res = await getMenus({ HasPermission: 1 })
      this.serviceRoutes = generateMenu(res.data)
      this.routes = this.generateRoutes(this.serviceRoutes)
    },
    async getRoles() {
      const res = await getRoles(delEmpty(this.search))
      this.total = res.data.TotalCount
      this.rolesList = res.data.Items.map(_ => {
        const obj = {
          flag: _.Name,
          key: _.Id,
          name: _.Remark1,
          description: _.Remark2,
          enable: _.Enable,
          routes: []
        }
        if (_.Menu) {
          obj.routes = generateMenu(_.Menu)
        }
        return obj
      })
    },
    generateRoutes(routes) {
      const res = []
      for (const route of routes) {
        let data = {}
        if (route.permission) {
          data = {
            id: route.id,
            permission: route.permission,
            title: route.title
          }
        } else {
          data = {
            id: route.id,
            title: route.meta && route.meta.title
          }
          if (route.permissionList && route.permissionList.length > 0) {
            data.children = this.generateRoutes(route.permissionList)
          } else {
            if (route.children) {
              data.children = this.generateRoutes(route.children)
            }
          }
        }
        res.push(data)
      }
      return res
    },
    generateArr(routes) {
      let data = []
      routes.forEach(route => {
        data.push(route)
        if (route.children) {
          const temp = this.generateArr(route.children)
          if (temp.length > 0) {
            data = [...data, ...temp]
          }
        }
      })
      return data
    },
    handleAddRole() {
      this.expandedArr = []
      this.role = Object.assign({}, defaultRole)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.expandedArr = []
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.role = deepClone(scope.row)
      this.$nextTick(() => {
        const nodes = this.generateArr(this.generateRoutes(this.role.routes))
        if (nodes) {
          this.expandedArr = nodes
        }
        this.$refs.tree.setCheckedNodes(nodes)
      })
    },
    handleDelete({ $index, row }) {
      this.$confirm('确认删除角色?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await deleteRole({
            Id: row.key,
            Name: row.flag
          })
          this.rolesList.splice($index, 1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(err => { console.error(err) })
    },
    generateTree(routes, checkedKeys) {
      return routes.filter(i => checkedKeys.includes(i.id)).map(_ => {
        if (_.children) {
          _.children = this.generateTree(_.children, checkedKeys)
        }
        if (_.permissionList) {
          _.permissionList = this.generateTree(_.permissionList, checkedKeys)
        }
        return _
      })
    },
    async confirmRole() {
      const isEdit = this.dialogType === 'edit'
      const checkedKeys = this.$refs.tree.getCheckedKeys()
      this.role.routes = this.generateTree(deepClone(this.serviceRoutes), checkedKeys)
      if (isEdit) {
        await updateRole({
          Name: this.role.flag,
          Id: this.role.key,
          Remark1: this.role.name,
          Remark2: this.role.description,
          Enable: this.role.enable,
          Menu: generateMenuApi(this.role.routes)
        })
        for (let index = 0; index < this.rolesList.length; index++) {
          if (this.rolesList[index].key === this.role.key) {
            this.rolesList.splice(index, 1, Object.assign({}, this.role))
            break
          }
        }
      } else {
        const { data } = await addRole({
          Name: this.role.flag,
          Id: this.role.key,
          Remark1: this.role.name,
          Remark2: this.role.description,
          Enable: this.role.enable,
          Menu: generateMenuApi(this.role.routes)
        })
        this.role.key = data.key
        this.rolesList.push(this.role)
      }

      const { description, key, name } = this.role
      this.dialogVisible = false
      this.$notify({
        title: '成功',
        dangerouslyUseHTMLString: true,
        message: `
            <div>角色编号: ${key}</div>
            <div>角色名称: ${name}</div>
            <div>描述: ${description}</div>
          `,
        type: 'success'
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

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
