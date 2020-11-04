<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddUser">新增</el-button>

    <el-table :data="rolesList" style="width: 100%;margin-top:30px;" stripe>
      <el-table-column align="center" label="用户编号" width="220">
        <template slot-scope="scope">
          {{ scope.row.key }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户名称" width="220">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="备注">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色">
        <template slot-scope="scope">
          {{ scope.row.role }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="danger" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑用户':'新增用户'">
      <el-form :model="user" :rules="rules" label-width="80px" label-position="left">
        <el-form-item label="用户名称" prop="name">
          <el-input v-model="user.name" placeholder="角色名称" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="user.description"
            :autosize="{ minRows: 4, maxRows: 8}"
            type="textarea"
            placeholder="角色"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmUser">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { getUsers, addUser, deleteUser, updateUser } from '@/api/user'
import { getRoles } from '@/api/role'
const defaultUser = {
  key: '',
  name: '',
  description: '',
  role: []
}

export default {
  data() {
    return {
      user: Object.assign({}, defaultUser),
      rolesList: [],
      usersList: [],
      dialogVisible: false,
      dialogType: 'new',
      rules: {
        name: [{ required: true, message: '请输入用户名称', trigger: 'blur' }]
      }
    }
  },
  computed: {
  },
  created() {
    this.getRoles()
  },
  methods: {
    async getRoles() {
      const res = await getRoles()
      this.rolesList = res.data
    },
    async getUsers() {
      const res = await getUsers()
      this.usersList = res.data
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
    handleDelete({ $index, row }) {
      this.$confirm('确认删除用户?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await deleteUser(row.key)
          this.usersList.splice($index, 1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(err => { console.error(err) })
    },
    async confirmUser() {
      const isEdit = this.dialogType === 'edit'
      if (isEdit) {
        await updateUser(this.user.key, this.user)
        for (let index = 0; index < this.usersList.length; index++) {
          if (this.usersList[index].key === this.user.key) {
            this.usersList.splice(index, 1, Object.assign({}, this.user))
            break
          }
        }
      } else {
        const { data } = await addUser(this.user)
        this.user.key = data.key
        this.usersList.push(this.user)
      }

      const { description, key, name } = this.user
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
