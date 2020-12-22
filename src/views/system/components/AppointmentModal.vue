<template>
  <el-dialog
    :title="type"
    :visible.sync="dialogVisible"
    :modal-append-to-body="false"
    width="800px"
  >
    <el-form ref="ruleForm" :model="modal" :rules="rule" label-width="80px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="所属公司" prop="CompanyName">
            <el-input v-model="modal.CompanyName" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="车牌号码" prop="CarLicense">
            <el-input v-model="modal.CarLicense" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="预约时间" prop="AppointmentDate">
            <el-date-picker
              v-model="modal.AppointmentDate"
              type="datetime"
              placeholder="选择日期时间"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 100%;"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="车型" prop="Type">
            <el-input v-model="modal.Type" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系人" prop="Contact">
            <el-input v-model="modal.Contact" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话" prop="Phone">
            <el-input v-model="modal.Phone" />
          </el-form-item>
        </el-col>
        <el-col v-if="this.type === '编辑'" :span="12">
          <el-form-item label="状态" prop="Status">
            <el-select v-model="modal.Status" style="width: 100%;">
              <el-option :value="0" disabled label="未处理" />
              <el-option :value="1" disabled -label="已处理" />
              <el-option :value="2" label="取消" />
              <el-option :value="3" disabled label="维修中" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="问题描述" prop="Description">
        <el-input v-model="modal.Description" :autosize="{ minRows: 4, maxRows: 6}" type="textarea" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="modal.Remark" :autosize="{ minRows: 4, maxRows: 6}" type="textarea" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addAppointment, updAppointment } from '@/api/system/appointment'
export default {
  data() {
    return {
      dialogVisible: false,
      type: '',
      modal: {
        CompanyName: '',
        CarLicense: '',
        Description: '',
        AppointmentDate: '',
        Type: '',
        Contact: '',
        Phone: '',
        Remark: '',
        Status: '未处理',
        SkuName: ''
      },
      loading: false,
      rule: {
        CarLicense: [{ required: true, message: '请输入车牌号', trigger: 'blur' }],
        AppointmentDate: [{ required: true, message: '请选择预约时间', trigger: 'blur' }],
        Contact: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
        Phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }]
      }
    }
  },
  computed: {
    disable() {
      return this.type === '编辑'
    }
  },
  watch: {},
  methods: {
    submit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.type === '新增') {
            addAppointment(this.modal).then(() => {
              this.success()
              this.$emit('handleSuccess')
              this.loading = false
              this.dialogVisible = false
            }).catch(() => {
              this.loading = false
            })
          } else {
            updAppointment(this.modal).then(() => {
              this.success()
              this.$emit('handleSuccess')
              this.loading = false
              this.dialogVisible = false
            }).catch(() => {
              this.loading = false
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    add() {
      this.type = '新增'
      this.dialogVisible = true
      this.modal = {
        SpuId: '',
        Catalog2Id: '',
        Description: '',
        Alarm: '',
        Brand: '',
        Price: '',
        Tool: '',
        addressList: []
      }
    },
    edit(row) {
      const obj = JSON.parse(JSON.stringify(row))
      this.type = '编辑'
      this.dialogVisible = true
      this.modal = obj
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
