<template>
  <el-dialog
    :title="type"
    :visible.sync="dialogVisible"
    width="50%"
  >
    <el-form ref="ruleForm" :model="modalValue" :rules="rules" label-width="120px">
      <el-form-item label="权限名称" prop="name">
        <el-input v-model="modalValue.name" />
      </el-form-item>
      <el-form-item label="父级菜单名称" prop="pid">
        <TreeSelect
          :props="props"
          :options="options"
          :value="modalValue.pid"
          :clearable="isClearable"
          :accordion="isAccordion"
          :choose-leaf="chooseLeaf"
          style="width: 100%;"
          @getValue="getValue"
        />
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number v-model="modalValue.sort" />
      </el-form-item>
      <el-form-item label="状态" prop="enable">
        <el-select v-model="modalValue.enable">
          <el-option label="启用" :value="1" />
          <el-option label="禁用" :value="0" />
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { deepClone } from '@/utils'
import { addPermission, updatePermission } from '@/api/permission/list'
import TreeSelect from '@/components/TreeSelect'
export default {
  components: { TreeSelect },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    currentPid: {
      type: String,
      default: () => ''
    },
    permissionId: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      dialogVisible: false,
      type: '',
      parentOpt: [],
      props: {
        value: 'id',
        label: 'name',
        children: 'children'
        // disabled:true
      },
      isClearable: true, // 可清空（可选）
      isAccordion: true, // 可收起（可选）
      chooseLeaf: true, // 只选叶子结点(可选)
      modalValue: {
        id: '',
        name: '',
        sort: 0,
        pid: '',
        enable: 1,
        permissionId: ''
      },
      rules: {
        name: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
        pid: [{ required: true, message: '请选择父级菜单', trigger: 'blur' }],
        enable: [{ required: true, message: '请选择启用状态', trigger: 'blur' }]
      }
    }
  },
  computed: {
    disable() {
      return this.type === '编辑'
    },
    options() {
      return this.parentOpt.concat(this.data)
    },
    changeParent() {
      return this.modalValue.pid === this.currentPid
    }
  },
  watch: {},
  methods: {
    getValue(value, data) {
      this.modalValue.pid = data.id
      this.modalValue.permissionId = data.permissionId
    },
    add() {
      this.type = '新增'
      this.dialogVisible = true
      this.modalValue.pid = this.currentPid
      this.modalValue.permissionId = this.permissionId
      this.modalValue.id = ''
      this.modalValue.name = ''
      this.modalValue.sort = 0
      this.modalValue.enable = 1
    },
    edit(row) {
      this.type = '编辑'
      row = JSON.parse(JSON.stringify(row))
      this.dialogVisible = true
      this.modalValue.pid = this.currentPid
      this.modalValue.permissionId = row.permissionId
      this.modalValue.id = row.id
      this.modalValue.name = row.name
      this.modalValue.sort = row.sort
      this.modalValue.path = row.enable
    },
    submit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.type === '编辑') {
            this.updModal(this.modalValue)
          } else {
            this.addModal(this.modalValue)
          }
        }
      })
    },
    async addModal(row) {
      const { data } = await addPermission({
        'Enable': row.enable,
        'ParentId': row.permissionId,
        'SortNum': row.sort,
        'Remark1': '',
        'Remark2': '',
        'Name': row.name
      })
      const obj = deepClone(row)
      this.dialogVisible = false
      obj.id = data
      if (this.changeParent) {
        this.$emit('handleAdd', obj)
      }
    },
    async updModal(row) {
      await updatePermission({
        'Id': row.id,
        'Enable': row.enable,
        'ParentId': row.permissionId,
        'SortNum': row.sort,
        'Remark1': '',
        'Remark2': '',
        'Name': row.name
      })
      this.dialogVisible = false
      const obj = deepClone(row)
      if (this.changeParent) {
        this.$emit('handleUpd', obj)
      } else {
        this.$emit('handleDel', obj)
      }
    }
  }
}

</script>
