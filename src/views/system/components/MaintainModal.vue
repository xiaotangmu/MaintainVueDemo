<template>
  <el-dialog
    :title="type"
    :visible.sync="dialogVisible"
    :modal-append-to-body="false"
    width="1100px"
    top="10px"
  >
    <el-form ref="ruleForm" :model="modal" :rules="rule" label-width="100px">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="基本信息" name="1">
          <el-row>
            <el-col :span="8">
              <el-form-item label="维修员工" prop="Staff">
                <el-input v-model="modal.Staff" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="负责人" prop="Operator">
                <el-input v-model="modal.Operator" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="创建时间" prop="StartDate">
                <el-date-picker
                  v-model="modal.StartDate"
                  type="datetime"
                  placeholder="选择日期时间"
                  format="yyyy-MM-dd HH:mm:ss"
                  style="width: 100%;"
                  :picker-options="pickerOptions"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="归还时间" prop="ReturnDate">
                <el-date-picker
                  v-model="modal.ReturnDate"
                  type="datetime"
                  placeholder="选择日期时间"
                  format="yyyy-MM-dd HH:mm:ss"
                  style="width: 100%;"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-card class="box-card" style="margin-bottom: 20px;">
            <div slot="header" class="clearfix">
              <el-col :span="12">
                <el-form-item label="绑定预约单" style="margin-bottom: 0;" prop="IsAppointment">
                  <el-select v-model="modal.IsAppointment" :disabled="disable" style="width: 300px;">
                    <el-option :value="1" label="不绑定" />
                    <el-option :value="0" label="绑定" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-if="modal.IsAppointment === 0" :span="12">
                <el-form-item label="维修预约单" style="margin-bottom: 0;" prop="AppointmentId">
                  <el-select v-model="modal.AppointmentId" :disabled="disable" style="width: 300px;">
                    <el-option v-for="i in appointmentList" :key="i.Id" :value="i.Id" :label="i.CarLicense" />
                  </el-select>
                </el-form-item>
              </el-col>
            </div>
            <el-col :span="12">
              <el-form-item label="车牌号">
                <el-input v-model="modal.AppointmentModel.CarLicense" :disabled="modal.IsAppointment === 0" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="车型">
                <el-input v-model="modal.AppointmentModel.Type" :disabled="modal.IsAppointment === 0" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="公司">
                <el-input v-model="modal.AppointmentModel.CompanyName" :disabled="modal.IsAppointment === 0" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系人">
                <el-input v-model="modal.AppointmentModel.Contact" :disabled="modal.IsAppointment === 0" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系电话">
                <el-input v-model="modal.AppointmentModel.Phone" :disabled="modal.IsAppointment === 0" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="问题描述">
                <el-input v-model="modal.AppointmentModel.Description" type="textarea" :autosize="{ minRows: 3, maxRows: 6 }" :disabled="modal.IsAppointment === 0" />
              </el-form-item>
            </el-col>
          </el-card>
          <el-button v-if="disable" type="primary" style="float: right; margin-bottom: 10px;" :loading="loading" @click="updInfo">
            更新
          </el-button>
        </el-collapse-item>
        <el-collapse-item title="设备选择" name="2">
          <el-tabs v-model="activeName">
            <el-card class="box-card">
              <el-select v-model="dictId" style="width: 200px; margin-bottom: 10px;">
                <el-option v-for="i in dictList.filter(_ => !modal.ChooseDictList.map(i => i.DictCode).includes(_.Code))" :key="i.Code" :value="JSON.stringify(i)" :label="i.Text" />
              </el-select>
              <!-- <el-button type="primary">查看</el-button> -->
              <el-button type="primary" @click="addDictItem()">添加</el-button>
              <el-button v-if="disable" type="primary" :loading="loading" @click="updDict">
                更新
              </el-button>
              <el-row v-for="i in dictList.filter(_ => modal.ChooseDictList.map(i => i.DictCode).includes(_.Code))" :key="i.DictCode" style="height: 40px; line-height: 40px; border-top: solid 1px #ccc;">
                <el-col :span="4">
                  <el-button type="danger" @click="delDictItem(i)">删除</el-button>
                </el-col>
                <el-col :span="20">
                  {{ i.Text }}
                </el-col>
              </el-row>
            </el-card>
          </el-tabs>
        </el-collapse-item>
        <el-collapse-item title="出库列表" name="3">
          <el-card class="box-card">
            <el-select v-model="outId" style="width: 200px; margin-bottom: 10px;">
              <el-option v-for="i in outList.filter(_ => !modal.OutList.map(i => i.OutId).includes(_.Id))" :key="i.Id" :value="JSON.stringify(i)" :label="i.OutNo" />
            </el-select>
            <!-- <el-button type="primary">查看</el-button> -->
            <el-button v-if="!disable" type="primary" @click="addOutItem()">添加</el-button>
            <el-button v-else type="primary" :loading="loading" @click="addOutItemByServer()">添加</el-button>
            <el-row style="height: 40px; line-height: 40px; border-top: solid 1px #ccc;">
              <el-col :span="4">
                操作
              </el-col>
              <el-col :span="20">
                出库编号
              </el-col>
            </el-row>
            <el-row v-for="i in modal.OutList" :key="i.OutId" style="height: 40px; line-height: 40px; border-top: solid 1px #ccc;">
              <el-col :span="4">
                <el-button v-if="!disable" type="danger" @click="delOutItem(i)">删除</el-button>
                <el-button v-else type="danger" :loading="loading" @click="delOutItemByServer(i)">删除</el-button>
              </el-col>
              <el-col :span="20">
                <el-tag type="primary">出库编号</el-tag>
                {{ i.OutNo }}
              </el-col>
            </el-row>
          </el-card>
        </el-collapse-item>
        <el-collapse-item v-if="disable" title="库存列表" name="4">
          <el-tabs v-model="activeName">
            <el-tab-pane label="零件列表" name="part-tab">
              <el-table
                :data="modal.SkuList"
                style="width: 100%"
              >
                <el-table-column
                  prop="SkuNo"
                  label="库存编码"
                />
                <el-table-column
                  prop="ProductName"
                  label="名称"
                />
                <el-table-column
                  prop="Brand"
                  label="品牌"
                />
                <el-table-column
                  label="属性"
                >
                  <template slot-scope="scope">
                    <el-tag v-for="i in scope.row.AttrList.filter(i => i.AttrName)" :key="i.Id">
                      {{ i.AttrName }}
                      {{ i.Value }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="Price"
                  label="价格"
                />
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="工具列表" name="tool-tab">
              <el-table
                :data="modal.ToolList"
                style="width: 100%"
              >
                <el-table-column
                  prop="SkuNo"
                  label="库存编码"
                />
                <el-table-column
                  prop="ProductName"
                  label="名称"
                />
                <el-table-column
                  prop="Brand"
                  label="品牌"
                />
                <el-table-column
                  label="属性"
                >
                  <template slot-scope="scope">
                    <el-tag v-for="i in scope.row.AttrList.filter(i => i.AttrName)" :key="i.Id">
                      {{ i.AttrName }}
                      {{ i.Value }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="Price"
                  label="价格"
                />
              </el-table>
            </el-tab-pane>
            <!-- <el-tab-pane label="旧配件列表" name="old-part-tab">
              <el-table
                :data="modal.OldPartList"
                style="width: 100%"
              >
                <el-table-column
                  prop="SkuNo"
                  label="库存编码"
                />
                <el-table-column
                  prop="ProductName"
                  label="名称"
                />
                <el-table-column
                  prop="Brand"
                  label="品牌"
                />
                <el-table-column
                  label="属性"
                >
                  <template slot-scope="scope">
                    <el-tag v-for="i in scope.row.AttrList.filter(i => i.AttrName)" :key="i.Id">
                      {{ i.AttrName }}
                      {{ i.Value }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="Price"
                  label="价格"
                />
              </el-table>
            </el-tab-pane> -->
          </el-tabs>
        </el-collapse-item>
      </el-collapse>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button v-show="!disable" type="primary" :loading="loading" @click="submit">确 定</el-button>
      <el-button v-if="disable" type="primary" :loading="loading" @click="confirmName">确认签名</el-button>
    </span>

    <el-dialog
      :title="valueTitle"
      :visible.sync="valueVisible"
      :append-to-body="true"
      width="40%"
      center
    >
      <el-form ref="valueForm" label-width="100px" style="padding: 20px;" :model="value" :rules="valueRule">
        <el-form-item v-show="!itemDisable" label="所属一级目录">
          <el-select v-model="catalog1Id" placeholder="请选择" style="width: 300px;">
            <el-option
              v-for="item in options"
              :key="item.Id"
              :label="item.CatalogName"
              :value="item.Id"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-show="!itemDisable" label="所属二级级目录" prop="Catalog2Id">
          <el-select v-model="Catalog2Id" placeholder="请选择" style="width: 300px;">
            <el-option
              v-for="item in catalogList"
              :key="item.Id"
              :label="item.CatalogName"
              :value="item.Id"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-show="!itemDisable" label="库存名" prop="SkuId">
          <el-select v-model="value.SkuId" placeholder="请选择" style="width: 300px;">
            <el-option
              v-for="item in spuList"
              :key="item.Id"
              :label="item.SkuName + '(' + (item.Tool === 0 ? '配件' : '工具') + ')'"
              :value="item.Id"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-show="!itemDisable" label="属性">
          <el-tag v-for="i in value.AttrList" :key="i.Id">
            {{ i.AttrName }}
            {{ i.Value }}
          </el-tag>
        </el-form-item>
        <el-form-item :label="'数量' + (value.Unit? ('(' + value.Unit + ')') : '')">
          <el-input-number v-model="value.Num" style="width: 300px;" :step="1" />
        </el-form-item>
        <el-form-item label="单价">
          <el-input-number v-model="value.Price" :precision="2" style="width: 300px;" :step="1" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="value.Remark" type="textarea" :autosize="{minRows: 2, maxRows: 4}" style="width: 300px;" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="valueVisible = false">取 消</el-button>
        <el-button type="primary" @click="addItem">确 定</el-button>
      </span>
    </el-dialog>
  </el-dialog>
</template>
<script>
import { getOutAllNoBind } from '@/api/system/out'
import { addMaintain, updInfo, addOut, delOut, confirm } from '@/api/system/maintain'
import { getAppointmentAll } from '@/api/system/appointment'
import { getList, getListBy1 } from '@/api/category/catalog'
import { getSkuList } from '@/api/system/sku'
import { getChildrenByType, updDict } from '@/api/dataDict'
export default {
  data() {
    return {
      dictId: '',
      dictList: [],
      activeNames: [],
      maintainId: '',
      spuList: [],
      catalogList: [],
      options: [],
      catalog1Id: '',
      Catalog2Id: '',
      outId: '',
      outList: [],
      activeName: 'part-tab',
      appointmentList: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      attrIndex: '',
      value: {
        SkuName: '',
        Num: '',
        Price: '',
        Remark: '',
        Status: 0,
        Brand: '',
        Unit: '',
        AttrList: [],
        SkuId: '',
        DealNum: 0
      },
      valueVisible: false,
      dialogVisible: false,
      type: '',
      modal: {
        AppointmentId: '',
        ChooseDictList: [],
        OutList: [],
        Staff: '',
        IsAppointment: 1,
        AppointmentModel: {
          CompanyName: '',
          CarLicense: '',
          Description: '',
          Type: '',
          Phone: '',
          Contact: ''
        },
        StartDate: '',
        ReturnDate: '',
        Operator: ''
      },
      loading: false,
      valueRule: {
        SkuId: [{ required: true, message: '请选择库存', trigger: 'blur' }]
      },
      rule: {
        Staff: [{ required: true, message: '请输入维修员工', trigger: 'blur' }],
        AppointmentId: [{ required: true, message: '请选择预约单', trigger: 'blur' }],
        StartDate: [{ required: true, message: '请选择创建时间', trigger: 'blur' }],
        Status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
        Operator: [{ required: true, message: '请输入负责人', trigger: 'blur' }]
      },
      valueTitle: '',
      addrIndex: ''
    }
  },
  computed: {
    disable() {
      return this.type === '编辑'
    },
    itemDisable() {
      return (this.valueTitle === '修改配件信息')
    }
  },
  watch: {
    catalog1Id(val) {
      this.Catalog2Id = ''
      if (!val) {
        return
      }
      getListBy1({ Catalog1Id: val }).then(res => {
        this.catalogList = res.data
      })
    },
    Catalog2Id(val) {
      this.value.SkuId = ''
      if (!val) {
        return
      }
      getSkuList({ Catalog2Id: val, PageIndex: 1, PageSize: 100 }).then(res => {
        this.spuList = res.data.Items
      })
    },
    'value.SkuId'(val) {
      if (val === '') {
        return
      }
      const index = this.spuList.findIndex(i => {
        return i.Id === val
      })
      if (index < 0) {
        this.value.SkuName = ''
        this.value.Unit = ''
        this.value.AttrList = []
        return
      }
      this.value.SkuName = this.spuList[index].SkuName
      this.value.Unit = this.spuList[index].Unit
      this.value.AttrList = this.spuList[index].AttrList
    },
    'modal.AppointmentId'(val) {
      if (!val) {
        return
      }
      const index = this.appointmentList.findIndex(i => i.Id === val)
      if (index > -1) {
        this.modal.AppointmentModel = this.appointmentList[index]
      }
    }
  },
  created() {
    this.getOutList()
    getAppointmentAll().then(res => {
      this.appointmentList = res.data
    })
    getList().then(res => {
      this.options = res.data
    })
    getChildrenByType({ TypeCode: 'Equipment' }).then(res => {
      this.dictList = res.data
    })
  },
  methods: {
    confirmName() {
      console.log(this.modal)
      this.$confirm('确认签名？').then(() => {
        confirm({
          MaintainId: this.modal.MaintainId,
          MaintainNo: this.modal.MaintainNo
        }).then(() => {
          this.success()
        })
      })
    },
    getOutList() {
      getOutAllNoBind().then(res => {
        this.outList = res.data
      })
    },
    updDict() {
      this.loading = true
      updDict({
        ChooseDictList: this.modal.ChooseDictList,
        MaintainId: this.modal.MaintainId,
        MaintainNo: this.modal.MaintainNo
      }).then(res => {
        this.$emit('handleSuccess')
        this.success()
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    addDictItem() {
      const row = JSON.parse(this.dictId)
      this.modal.ChooseDictList.push({ DictCode: row.Code, Text: row.Text })
      this.dictId = ''
    },
    delDictItem(i) {
      const index = this.modal.ChooseDictList.findIndex(_ => _.DictCode === i.Code)
      this.modal.ChooseDictList.splice(index, 1)
    },
    addOutItemByServer() {
      this.loading = true
      const row = JSON.parse(this.outId)
      addOut({
        OutList: [
          {
            OutId: row.Id
          }
        ],
        MaintainId: this.modal.MaintainId,
        MaintainNo: this.modal.MaintainNo
      }).then(res => {
        this.$emit('handleSuccess')
        this.success()
        this.loading = false
        this.modal = res.data
        // this.modal.OutList.push({ OutId: row.Id, OutNo: row.OutNo })
        this.outId = ''
        this.getOutList()
      }).catch(() => {
        this.loading = false
      })
    },
    delOutItemByServer(row) {
      this.$confirm('确认删除?(' + row.OutNo	 + ')')
        .then(() => {
          delOut({
            OutList: [
              {
                OutId: row.OutId
              }
            ],
            MaintainId: this.modal.MaintainId,
            MaintainNo: this.modal.MaintainNo
          }).then(res => {
            this.$emit('handleSuccess')
            this.success()
            this.loading = false
            this.modal = res.data
            this.getOutList()
            // const index = this.modal.OutList.findIndex(_ => _.OutId === row.OutId)
            // this.modal.OutList.splice(index, 1)
          }).catch(() => {
            this.loading = false
          })
        })
        .catch(() => {})
    },
    addOutItem() {
      const row = JSON.parse(this.outId)
      this.modal.OutList.push({ OutId: row.Id, OutNo: row.OutNo })
      this.outId = ''
    },
    delOutItem(i) {
      const index = this.modal.OutList.findIndex(_ => _.OutId === i.OutId)
      this.modal.OutList.splice(index, 1)
    },
    updInfo() {
      this.loading = true
      updInfo(this.modal).then(() => {
        this.$emit('handleSuccess')
        this.success()
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleEdit2(index, row) {
      this.addrIndex = index
      this.value = JSON.parse(JSON.stringify(row))
      this.valueVisible = true
      this.valueTitle = '修改配件信息'
    },
    addItem() {
      this.$refs.valueForm.validate((valid) => {
        if (valid) {
          const obj = JSON.parse(JSON.stringify(this.value))
          if (this.disable) {
            obj.MaintainId = this.maintainId
          }
          if (this.valueTitle === '添加配件信息') {
            this.modal.OldPartList.push(obj)
          } else {
            this.modal.OldPartList.splice(this.addrIndex, 1, obj)
          }
          this.valueVisible = false
        }
      })
    },
    newItem2() {
      this.valueVisible = true
      this.valueTitle = '添加配件信息'
      this.value = {
        SkuName: '',
        Num: '',
        Price: '',
        Remark: '',
        Status: 0,
        Brand: '',
        Unit: '',
        AttrList: [],
        SkuId: '',
        DealNum: 0
      }
    },
    handleDelete2(index) {
      this.$confirm('确认删除?')
        .then(() => {
          this.modal.OldPartList.splice(index, 1)
        })
        .catch(() => {})
    },
    submit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.type === '新增') {
            addMaintain(this.modal).then(() => {
              this.success()
              this.$emit('handleSuccess')
              this.loading = false
              this.dialogVisible = false
            }).catch(() => {
              this.loading = false
            })
          }
        }
      })
    },
    cancel() {
      this.dialogVisible = false
    },
    add() {
      this.type = '新增'
      this.dialogVisible = true
      this.activeNames = ['1']
      this.modal = {
        AppointmentId: '',
        ChooseDictList: [],
        OutList: [],
        Staff: '',
        IsAppointment: 1,
        AppointmentModel: {
          CompanyName: '',
          CarLicense: '',
          Description: '',
          Type: '',
          Phone: '',
          Contact: ''
        },
        StartDate: '',
        ReturnDate: '',
        Operator: ''
      }
    },
    edit(row) {
      this.activeNames = ['1']
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
