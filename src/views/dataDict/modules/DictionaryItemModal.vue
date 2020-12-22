<template>
  <el-dialog
    :title="type !== 'new' ? '编辑' : '新增'"
    :visible.sync="dialogVisible"
    :modal-append-to-body="false"
    width="700px"
  >
    <el-form ref="ruleForm" :model="modal" label-width="100px" :rules="rule">
      <el-form-item label="字典类型">
        <el-input
          v-model="typeCode"
          disabled
          placeholder="字典类型"
        />
      </el-form-item>
      <el-form-item label="字典编码" prop="code">
        <el-input
          v-model="modal.code"
          :disabled="type !== 'new'"
          placeholder="字典编码"
        />
      </el-form-item>
      <el-form-item label="字典名称">
        <el-input
          v-model="name"
          placeholder="字典名称"
        />
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number v-model="sort" label="排序" />
      </el-form-item>
      <el-form-item label="描述">
        <el-input
          v-model="description"
          placeholder="描述"
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 6 }"
        />
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">关闭</el-button>
      <el-button type="primary" :loading="loading" @click="handleClose">提交</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { add, update } from '@/api/dataDict'
import { addAppointment, updAppointment } from '@/api/system/appointment'
export default {
  data() {
    return {
      id: '',
      modal: {
        code: ''
      },
      code: '',
      typeCode: '',
      dataType: '',
      name: '',
      sort: 0,
      description: '',
      rule: {
        code: [{ required: true, message: '请填写字典编码', trigger: 'blur' }]
      },
      loading: false,
      dialogVisible: false,
      type: ''
    }
  },
  methods: {
    edit(row) {
      this.dialogVisible = true
      this.type = 'edit'
      this.modal.code = row.code
      this.id = row.id
      this.typeCode = row.typeCode
      this.dataType = row.dataType
      this.name = row.name
      this.sort = row.sort
      this.description = row.description
    },
    add(code, type) {
      this.dialogVisible = true
      this.type = 'new'
      this.modal.code = ''
      this.id = ''
      this.typeCode = code
      this.dataType = type
      this.name = ''
      this.sort = ''
      this.description = ''
    },
    handleClose() {
      this.$confirm(
        (this.type === 'edit'
          ? '确认更改'
          : '确认添加') + '?'
      )
        .then(() => {
          this.loading = true
          if (this.type === 'edit') {
            update({
              'Id': this.id,
              'DataType': this.dataType,
              'TypeCode': this.typeCode,
              'Code': this.modal.code,
              'Text': this.name,
              'IsLeaf': 1,
              'Description': this.description,
              'SortNum': this.sort
            })
              .then(() => {
                this.success()
              })
              .catch(() => {
                this.loading = false
              })
          } else {
            this.$refs.ruleForm.validate((valid) => {
              if (valid) {
                add({
                  'DataType': this.dataType,
                  'TypeCode': this.typeCode,
                  'Code': this.modal.code,
                  'Text': this.name,
                  'IsLeaf': 1,
                  'Description': this.description,
                  'SortNum': this.sort
                })
                  .then(() => {
                    this.success()
                  })
                  .catch(() => {
                    this.loading = false
                  })
              } else {
                this.loading = false
              }
            })
          }
        })
        .catch(() => {})
    },
    success() {
      this.loading = false
      this.dialogVisible = false
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      this.$emit('handleSuccess')
    }
  }
}
</script>
