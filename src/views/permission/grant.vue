<template>
  <div class="app-container">
    <el-input v-model="search.SearchStr" placeholder="模糊查询" style="width: 350px;">
      <el-select slot="prepend" v-model="search.Enable" placeholder="请选择" style="width: 80px;">
        <el-option v-for="i in options" :key="i.value" :value="i.value" :label="i.label" />
      </el-select>
      <el-button slot="append" type="primary" icon="el-icon-search" @click="getList()" />
    </el-input>
    <el-button type="primary" @click="handleAddUser">新增</el-button>

    <el-table :data="usersList" style="width: 100%;margin-top:30px;" stripe>
      <el-table-column type="expand" label="备注">
        <template slot-scope="scope">
          {{ scope.row.remark }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户名称" width="220">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="描述">
        <template slot-scope="scope">
          {{ scope.row.introduction }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色">
        <template slot-scope="scope">
          <el-tag v-for="i in scope.row.role" :key="i.key">{{ i.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="启用" width="100">
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
          <el-button type="primary" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="warning" @click="handleReset(scope.row)">重置</el-button>
          <el-button type="danger" @click="handleDelete(scope)">删除</el-button>
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

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑用户':'新增用户'">
      <el-form ref="ruleForm" :model="user" :rules="rules" label-width="80px">
        <el-form-item label="用户名称" prop="name">
          <el-input v-model="user.name" placeholder="角色名称" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="user.introduction"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="描述"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="user.remark"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="备注"
          />
        </el-form-item>
        <el-form-item label="状态" prop="enable">
          <el-select v-model="user.enable">
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="user.roleKey" style="width: 100%;" multiple placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            />
          </el-select>
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
import { deepClone } from '@/utils'
import { delEmpty } from '@/utils/utils'
import { getUsers, addUser, deleteUser, updateUser, enableUser, resetUser } from '@/api/permission/grant'
import { getRolesAll } from '@/api/permission/role'
const defaultUser = {
  key: '',
  name: '',
  introduction: '',
  remark: '',
  enable: 1,
  roleKey: [],
  role: []
}

export default {
  data() {
    return {
      total: 0,
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
      search: {
        SearchStr: '',
        Enable: -1,
        PageIndex: 1,
        PageSize: 10
      },
      user: Object.assign({}, defaultUser),
      rolesList: [],
      usersList: [],
      dialogVisible: false,
      dialogType: 'new',
      rules: {
        name: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
        enable: [{ required: true, message: '请输入用户名称', trigger: 'blur' }]
      }
    }
  },
  watch: {
    'user.roleKey': {
      handler(val) {
        this.user.role = this.rolesList.filter(i => val.includes(i.key))
      },
      deep: true
    }
  },
  created() {
    this.getRoles()
    this.getList()
  },
  methods: {
    async getRoles() {
      const res = await getRolesAll()
      this.rolesList = res.data.map(_ => {
        return {
          key: _.Id,
          name: _.Name
        }
      })
    },
    async getList() {
      const res = await getUsers(delEmpty(this.search))
      this.total = res.data.TotalCount
      const users = res.data.Items
      this.usersList = users.map(_ => {
        const obj = {
          key: _.Id,
          name: _.LoginName,
          enable: _.Enable,
          introduction: _.Remark1,
          remark: _.Remark2,
          role: _.RoleList.map(role => {
            return {
              key: role.Id,
              name: role.Name
            }
          }),
          roleKey: _.RoleList.map(role => role.Id)
        }
        return obj
      })
    },
    handleAddUser() {
      this.user = Object.assign({}, defaultUser)
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.user = deepClone(scope.row)
    },
    changeEnable(row) {
      enableUser({
        LoginName: row.name,
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
    handleReset(row) {
      this.$confirm('确认重置用户?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          resetUser({
            LoginName: row.name
          }).then(() => {
            this.success()
          })
        })
        .catch(err => { console.error(err) })
    },
    handleDelete({ $index, row }) {
      this.$confirm('确认删除用户?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await deleteUser({ Id: row.key, LoginName: row.name })
          this.usersList.splice($index, 1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(err => { console.error(err) })
    },
    submit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.confirmUser()
        }
      })
    },
    async confirmUser() {
      const isEdit = this.dialogType === 'edit'
      if (isEdit) {
        await updateUser({
          Id: this.user.key,
          LoginName: this.user.name,
          Enable: this.user.enable,
          Remark1: this.user.introduction,
          Remark2: this.user.remark,
          RoleIdList: this.user.role.map(role => {
            return {
              RoleId: role.key
            }
          })
        })
        for (let index = 0; index < this.usersList.length; index++) {
          if (this.usersList[index].key === this.user.key) {
            this.usersList.splice(index, 1, Object.assign({}, this.user))
            break
          }
        }
      } else {
        const { data } = await addUser({
          Id: this.user.key,
          LoginName: this.user.name,
          Enable: this.user.enable,
          Remark1: this.user.introduction,
          Remark2: this.user.remark,
          RoleIdList: this.user.role.map(role => {
            return {
              RoleId: role.key
            }
          })
        })
        this.user.key = data.key
        this.usersList.push(this.user)
      }

      const { description, name } = this.user
      this.dialogVisible = false
      this.$notify({
        title: '成功',
        dangerouslyUseHTMLString: true,
        message: `
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
