<template>
  <el-dialog
    :title="type !== 'new' ? '编辑' : '新增'"
    :visible.sync="dialogVisible"
    width="700px"
  >
    <el-form label-width="100px">
      <el-form-item label="类型编码">
        <el-input
          v-model="typeCode"
          :disabled="type !== 'new'"
          placeholder="类型编码"
        />
      </el-form-item>
      <!--      <el-form-item label="字典项类型">-->
      <!--        <el-input-->
      <!--          v-model="dataType"-->
      <!--          placeholder="字典项类型"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="">-->
      <!--        <el-input-->
      <!--          v-model="code"-->
      <!--          placeholder="字典项编码"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <el-form-item label="名称">
        <el-input
          v-model="name"
          placeholder="字典项名称"
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
      </el-form-item></el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleClose">确认</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { add, update } from '@/api/dataDict'
export default {
  data() {
    return {
      id: '',
      code: '',
      typeCode: '',
      dataType: '',
      name: '',
      sort: 0,
      description: '',

      loading: false,
      dialogVisible: false,
      type: ''
    }
  },
  methods: {
    edit(row) {
      this.dialogVisible = true
      this.type = 'edit'
      this.id = row.id
      this.code = row.code
      this.typeCode = row.typeCode
      this.dataType = row.dataType
      this.name = row.name
      this.sort = row.sort
      this.description = row.description
    },
    add() {
      this.dialogVisible = true
      this.type = 'new'
      this.id = ''
      this.code = ''
      this.typeCode = ''
      this.dataType = ''
      this.name = ''
      this.sort = ''
      this.description = ''
    },
    handleClose() {
      this.$confirm(
        (this.type === 'edit'
          ? '确认修改'
          : '确认添加') + '?'
      )
        .then(() => {
          this.loading = true
          if (this.type === 'edit') {
            update({
              'Id': this.id,
              'DataType': this.dataType,
              'TypeCode': this.typeCode,
              'Code': this.code,
              'Text': this.name,
              'IsLeaf': 0,
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
            add({
              'DataType': this.dataType,
              'TypeCode': this.typeCode,
              'Code': this.code,
              'Text': this.name,
              'IsLeaf': 0,
              'Description': this.description,
              'SortNum': this.sort
            })
              .then(() => {
                this.success()
              })
              .catch(() => {
                this.loading = false
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
