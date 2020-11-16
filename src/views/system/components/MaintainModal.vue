<template>
  <el-dialog
    :title="type"
    :visible.sync="dialogVisible"
    :modal-append-to-body="false"
    width="60%"
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
              <el-form-item label="状态" prop="Status">
                <el-select v-model="modal.Status" style="width: 100%;">
                  <el-option :value="1" :label="'未处理'" />
                  <el-option :value="2" :label="'已处理'" />
                  <el-option :value="3" :label="'维修取消'" />
                </el-select>
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
                  value-format="yyyy-MM-dd HH:mm:ss"
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
                  value-format="yyyy-MM-dd HH:mm:ss"
                  style="width: 100%;"
                />
              </el-form-item>
            </el-col>
            <el-col v-if="disable" :span="8">
              <el-button type="primary" style="float: right;" :loading="loading" @click="updInfo">
                更新
              </el-button>
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item title="维修单信息" name="2">
          <el-card class="box-card" style="margin-bottom: 20px;">
            <div slot="header" class="clearfix">
              <el-form-item label="维修预约单" style="margin-bottom: 0;" prop="AppointmentId">
                <el-select v-model="modal.AppointmentId" :disabled="disable" style="width: 300px;">
                  <el-option v-for="i in appointmentList" :key="i.Id" :value="i.Id" :label="i.CarLicense" />
                </el-select>
              </el-form-item>
            </div>
            <el-col :span="8">
              <el-form-item label="车牌号">
                <el-input v-model="info.CarLicense" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="车型">
                <el-input v-model="info.Type" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="描述">
                <el-input v-model="info.Description" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="联系人">
                <el-input v-model="info.Contact" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="联系电话">
                <el-input v-model="info.Phone" disabled />
              </el-form-item>
            </el-col>
          </el-card>
        </el-collapse-item>
        <el-collapse-item title="出库信息" name="3">
          <el-col :span="12" style="position: absolute; right: 10px; z-index: 1000;">
            <el-form-item label="出库表">
              <el-select v-model="outId" style="width: 200px;">
                <el-option v-for="i in outList.filter(_ => !outIdList.map(i => i.OutId).includes(_.Id))" :key="i.Id" :value="i.Id" :label="i.OutNo" />
              </el-select>
              <el-button v-if="disable" type="primary" :loading="loading" @click="updByOut">
                更新
              </el-button>
            </el-form-item>
          </el-col>
          <el-tabs v-model="activeName">
            <el-tab-pane label="工具列表" name="tool-tab">
              <el-card class="box-card">
                <el-button v-if="disable" type="primary" style="float: right;" :loading="loading" @click="updTool">
                  更新
                </el-button>
                <el-table
                  :data="modal.ToolList"
                  style="width: 100%"
                >
                  <el-table-column
                    prop="SkuName"
                    label="名称"
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
                    label="数量"
                  >
                    <template slot-scope="scope">
                      {{ scope.row.Num + '(' + scope.row.Unit + ')' }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="赔偿金额"
                    align="center"
                    width="300px"
                  >
                    <template slot-scope="scope">
                      <el-input-number v-model="scope.row.Compensation" :disabled="!disable" :precision="2" :step="1" />
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="归还数量"
                    align="center"
                    width="300px"
                  >
                    <template slot-scope="scope">
                      <el-input-number v-model="scope.row.DealNum" :disabled="!disable" :step="1" :max="scope.row.Num" />
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="新旧"
                  >
                    <template slot-scope="scope">
                      {{ scope.row.Status === 0 ? "新" : "旧" }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="Remark"
                    label="备注"
                  />
                </el-table>
              </el-card>
            </el-tab-pane>
            <el-tab-pane label="零件列表" name="old-part-tab">
              <el-card class="box-card">
                <el-table
                  :data="modal.SkuList"
                  style="width: 100%"
                >
                  <el-table-column
                    prop="SkuName"
                    label="名称"
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
                    label="单价"
                  />
                  <el-table-column
                    label="数量"
                  >
                    <template slot-scope="scope">
                      {{ scope.row.Num + '(' + scope.row.Unit + ')' }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="新旧"
                  >
                    <template slot-scope="scope">
                      {{ scope.row.Status === 0 ? "新" : "旧" }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="Remark"
                    label="备注"
                  />
                </el-table>
              </el-card>
            </el-tab-pane>
            <el-tab-pane label="旧配件列表" name="part-tab">
              <el-card class="box-card">
                <el-button type="primary" @click="newItem2">新增</el-button>
                <el-button v-if="disable" type="primary" style="float: right;" :loading="loading" @click="updPart">
                  更新
                </el-button>
                <el-table
                  :data="modal.OldPartList"
                  style="width: 100%"
                >
                  <el-table-column align="left" width="180px" label="操作">
                    <template slot-scope="scope">
                      <el-button :disabled="scope.row.disable" @click="handleEdit2(scope.$index, scope.row)">编辑</el-button>
                      <el-button
                        type="danger"
                        :disabled="scope.row.disable"
                        @click="handleDelete2(scope.$index)"
                      >删除</el-button>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="SkuName"
                    label="名称"
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
                    label="单价"
                  />
                  <el-table-column
                    label="数量"
                  >
                    <template slot-scope="scope">
                      {{ scope.row.Num + '(' + scope.row.Unit + ')' }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="Remark"
                    label="备注"
                  />
                </el-table>
              </el-card>
            </el-tab-pane>
          </el-tabs>
        </el-collapse-item>
      </el-collapse>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button v-show="!disable" type="primary" :loading="loading" @click="submit">确 定</el-button>
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
import { getOutAll } from '@/api/system/out'
import { addMaintain, updInfo, updTool, updPart, updByOut } from '@/api/system/maintain'
import { getAppointmentAll } from '@/api/system/appointment'
import { getList, getListBy1 } from '@/api/category/catalog'
import { getSkuList } from '@/api/system/sku'
export default {
  data() {
    return {
      outIdList: [],
      tool: {
        initList: [],
        asyncList: []
      },
      part: {
        initList: [],
        asyncList: []
      },
      activeNames: ['1'],
      maintainId: '',
      spuList: [],
      catalogList: [],
      options: [],
      catalog1Id: '',
      Catalog2Id: '',
      outId: '',
      outList: [],
      info: {
        CompanyName: '',
        CarLicense: '',
        Type: '',
        Description: '',
        Contact: '',
        Phone: ''
      },
      activeName: 'tool-tab',
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
        MaintainNo: '',
        Staff: '',
        AppointmentId: '',
        StartDate: '',
        Status: '',
        ReturnDate: '',
        Operator: '',
        ToolList: [],
        OldPartList: [],
        SkuList: [],
        OutList: []
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
    },
    allTool() {
      return this.tool.initList.concat(this.tool.asyncList)
    },
    allPart() {
      return this.part.initList.concat(this.part.asyncList)
    }
  },
  watch: {
    allTool: {
      handler(val) {
        this.modal.ToolList = this.tool.initList.concat(this.tool.asyncList)
      },
      immediate: true,
      deep: true
    },
    allPart: {
      handler(val) {
        this.modal.SkuList = this.part.initList.concat(this.part.asyncList)
      },
      immediate: true,
      deep: true
    },
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
    outId(val) {
      const index = this.outList.findIndex(i => i.Id === val)
      if (index > -1) {
        this.modal.OutList = this.outIdList.concat([{ OutId: this.outList[index].Id }])
        this.tool.asyncList = this.outList[index].skuList.filter(i => i.Tool === 1).map(i => {
          return {
            Price: i.Price,
            SkuName: i.SkuName,
            Brand: i.Brand,
            Unit: i.Unit,
            AttrList: i.AttrList,
            Id: i.Id,
            Remark: i.Description,
            OutSkuId: i.Id,
            Num: i.TotalCount,
            DealNum: 0,
            Status: i.AddressModel.Status,
            Compensation: 0
          }
        })
        this.part.asyncList = this.outList[index].skuList.filter(i => i.Tool === 0).map(i => {
          return {
            SkuName: i.SkuName,
            Brand: i.Brand,
            Unit: i.Unit,
            AttrList: i.AttrList,
            Id: i.Id,
            Price: i.Price,
            Remark: i.Description,
            SkuId: i.SkuId,
            Num: i.TotalCount,
            DealNum: 0,
            Status: i.AddressModel.Status,
            disable: true
          }
        })
      }
    },
    'modal.AppointmentId'(val) {
      if (!val) {
        return
      }
      const index = this.appointmentList.findIndex(i => i.Id === val)
      if (index > -1) {
        this.info = this.appointmentList[index]
        this.modal.MaintainNo = this.appointmentList[index].AppointmentNo
      }
    }
  },
  created() {
    getList().then(res => {
      this.options = res.data
    })
    getAppointmentAll().then(res => {
      this.appointmentList = res.data
    })
    getOutAll().then(res => {
      this.outList = res.data
    })
  },
  methods: {
    handleEdit2(index, row) {
      this.addrIndex = index
      this.value = row
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
    updTool() {
      this.loading = true
      updTool(this.modal).then(() => {
        this.$emit('handleSuccess')
        this.success()
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    updByOut() {
      this.loading = true
      updByOut(this.modal).then(() => {
        this.$emit('handleSuccess')
        this.success()
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    updPart() {
      this.loading = true
      updPart(this.modal).then(() => {
        this.$emit('handleSuccess')
        this.success()
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
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
      this.outIdList = []
      this.type = '新增'
      this.dialogVisible = true
      this.activeNames = ['1', '2']
      this.outId = ''
      this.maintainId = ''
      this.tool.initList = []
      this.tool.asyncList = []
      this.part.initList = []
      this.part.asyncList = []
      this.modal = {
        MaintainNo: '',
        Staff: '',
        AppointmentId: '',
        StartDate: '',
        Status: '',
        ReturnDate: '',
        Operator: '',
        ToolList: [],
        OldPartList: [],
        SkuList: [],
        OutList: []
      }
      this.info = {
        CompanyName: '',
        CarLicense: '',
        Type: '',
        Description: '',
        Contact: '',
        Phone: ''
      }
    },
    edit(row) {
      this.activeNames = ['1', '3']
      const obj = JSON.parse(JSON.stringify(row))
      this.type = '编辑'
      this.dialogVisible = true
      this.modal = obj
      this.maintainId = obj.Id
      this.tool.asyncList = []
      this.part.asyncList = []
      this.outIdList = obj.OutList
      this.tool.initList = this.modal.ToolList.map(i => {
        i.MaintainId = this.maintainId
        return i
      })
      this.part.initList = this.modal.SkuList.map(i => {
        i.MaintainId = this.maintainId
        i.Num = i.TotalCount
        return i
      })
      this.modal.OldPartList = this.modal.OldPartList.map(i => {
        i.MaintainId = this.maintainId
        return i
      })
      this.outId = ''
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
