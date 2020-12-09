<template>
  <el-dialog
    :title="type"
    :visible.sync="dialogVisible"
    :modal-append-to-body="false"
    width="1100px"
  >
    <el-form ref="ruleForm" :model="modal" :rules="rule" label-width="100px">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="基本信息" name="1">
          <el-row>
            <el-col :span="8">
              <el-form-item label="来源">
                <el-select v-model="modal.Type" :disabled="disable">
                  <el-option :value="0" label="供应商" />
                  <el-option :value="1" label="维修单" />
                  <el-option :value="2" label="出库单坏件" />
                  <el-option :value="3" label="维修完成回库" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="批次" prop="Batch">
                <el-input-number v-model="modal.Batch" :step="1" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="操作员" prop="Operator">
                <el-input v-model="modal.Operator" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item v-show="modal.Type === 0" label="供应商">
                <el-input v-model="modal.SupplierName" />
              </el-form-item>
              <el-form-item v-show="modal.Type === 2" label="出库单">
                <el-select v-model="modal.OutId">
                  <el-option v-for="i in outList" :key="i.Id" :label="i.OutNo" :value="i.Id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item v-show="modal.Type === 1" label="维修单">
                <el-select v-model="modal.MaintainId" placeholder="请选择" :disabled="disable">
                  <el-option
                    v-for="item in maintainList"
                    :key="item.MaintainId"
                    :label="item.MaintainNo"
                    :value="item.MaintainId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="入库时间" prop="EntryDate">
                <el-date-picker
                  v-model="modal.EntryDate"
                  type="datetime"
                  placeholder="选择日期时间"
                  format="yyyy-MM-dd HH:mm:ss"
                  style="width: 100%;"
                  :picker-options="pickerOptions"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="总金额">
                {{ entryTotal | toMoney }}
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注">
                <el-input v-model="modal.Description" :autosize="{ minRows: 4, maxRows: 6 }" type="textarea" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-button v-if="disable" type="primary" style="float: right; margin-bottom: 10px;" :loading="loading" @click="updMain">
            更新
          </el-button>
        </el-collapse-item>
        <el-collapse-item title="库存信息" name="2">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <el-button v-show="modal.Type === 0 || modal.Type === 3" style="float: right; padding: 3px 0" type="text" @click="newItem">新增</el-button>
            </div>
            <el-table
              :data="modal.entrySkuList"
              style="width: 100%"
            >
              <el-table-column v-if="modal.Type === 0 || !disable" align="left" width="240px" label="操作">
                <template slot-scope="scope">
                  <el-button
                    v-if="!disable"
                    type="danger"
                    @click="handleDelete(scope.$index)"
                  >删除</el-button>
                  <el-button
                    v-if="disable"
                    :loading="loading"
                    type="danger"
                    @click="delByServer(scope.row, scope.$index)"
                  >删除</el-button>
                  <el-button
                    v-if="disable"
                    :loading="loading"
                    type="primary"
                    @click="updByServer(scope.row, scope.$index)"
                  >更新</el-button>
                </template>
              </el-table-column>
              <el-table-column
                prop="SkuNo"
                label="库存编号"
              />
              <el-table-column
                prop="SkuName"
                label="库存名称"
              />
              <el-table-column
                label="位置"
                align="center"
              >
                <template slot-scope="scope">
                  <template v-if="!disable">
                    房间<el-input v-model="scope.row.Room" />
                    货架<el-input v-model="scope.row.Self" />
                  </template>
                  <template v-else>
                    {{ "房间" + scope.row.Room + ",货架" + scope.row.Self }}
                  </template>
                </template>
              </el-table-column>
              <el-table-column
                label="单价"
                width="300px"
                align="center"
              >
                <template slot-scope="scope">
                  <el-input-number v-if="!disable" v-model="scope.row.Price" :precision="2" :step="1" />
                  <template v-else>
                    {{ scope.row.Price | toMoney }}
                  </template>
                </template>
              </el-table-column>
              <el-table-column
                label="类型"
              >
                <template slot-scope="scope">
                  {{ scope.row.Status === 0 ? "新" : scope.row.Status === 1 ? "旧" : "工具" }}
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-collapse-item>
      </el-collapse>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button v-if="!disable" type="primary" :loading="loading" @click="submit">确 定</el-button>
    </span>
    <el-dialog
      :title="valueTitle"
      :visible.sync="valueVisible"
      :append-to-body="true"
      width="600px"
    >
      <el-form ref="valueForm" label-width="120px" :model="value" style="padding: 20px;" :rules="valueRule">
        <el-form-item v-show="!itemDisable" label="所属一级目录">
          <el-select v-model="catalog1Id" placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="item in options"
              :key="item.Id"
              :label="item.CatalogName"
              :value="item.Id"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-show="!itemDisable" label="所属二级级目录" prop="Catalog2Id">
          <el-select v-model="Catalog2Id" placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="item in catalogList"
              :key="item.Id"
              :label="item.CatalogName"
              :value="item.Id"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-show="!itemDisable" label="库存" prop="SkuId">
          <el-select v-model="value.SkuId" placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="item in spuList"
              :key="item.Id"
              :label="item.SkuName + '(' + (item.Tool===0?'配件':'工具') + ')'"
              :value="item.Id"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-show="!itemDisable" label="属性">
          <el-tag v-for="i in AttrList" :key="i.Id">
            {{ i.AttrName }}
            {{ i.Value }}
          </el-tag>
        </el-form-item>
        <el-form-item label="库存编号">
          <el-input v-model="value.SkuNo" :disabled="itemDisable" style="width: 100%;" />
        </el-form-item>
        <el-form-item v-if="itemDisable" label="库存名称">
          <el-input v-model="value.SkuName" disabled style="width: 100%;" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="房间">
              <el-input v-model="value.Room" placeholder="请输入房间" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="货架">
              <el-input v-model="value.Self" placeholder="请输入货架" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="单价">
          <el-input-number v-model="value.Price" :precision="2" style="width: 100%;" :step="1" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="valueVisible = false">取 消</el-button>
        <el-button v-if="!disable" type="primary" @click="addItem">确 定</el-button>
        <el-button v-if="disable" type="primary" @click="updItem">确 定</el-button>
      </span>
    </el-dialog>
  </el-dialog>
</template>

<script>
import { getSkuList } from '@/api/system/sku'
import { addEntry, updEntry, delSku, updSku, addSku } from '@/api/system/entry'
import { getMaintainAll } from '@/api/system/maintain'
import { getList, getListBy1 } from '@/api/category/catalog'
import { getBad } from '@/api/system/out'
export default {
  data() {
    return {
      updSkuIndex: '',
      activeNames: [],
      outList: [],
      AttrList: [],
      maintainList: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      value: {
        SkuId: '',
        OldPartId: '',
        ToolId: '',
        EntryId: '',
        Price: 0,
        Room: '',
        Self: '',
        Status: 0,
        SkuNo: '',
        SkuName: ''
      },
      valueVisible: false,
      dialogVisible: false,
      type: '',
      modal: {
        EntryNo: '',
        Operator: '',
        TotalPrice: 0,
        EntryDate: '',
        Batch: 0,
        SupplierName: '',
        Description: '',
        Type: 0,
        MaintainId: '',
        OutId: '',
        entrySkuList: []
      },
      loading: false,
      options: [],
      catalog1Id: '',
      Catalog2Id: '',
      rule: {
        Operator: [{ required: true, message: '请输入操作员', trigger: 'blur' }],
        Batch: [{ required: true, message: '请输入批次', trigger: 'blur' }],
        EntryDate: [{ required: true, message: '请选择入库时间', trigger: 'blur' }]
      },
      catalogList: [],
      spuList: [],
      valueTitle: ''
    }
  },
  computed: {
    disable() {
      return this.type === '编辑'
    },
    itemDisable() {
      return this.valueTitle === '更新入库信息'
    },
    entryTotal() {
      return this.modal.entrySkuList.reduce((total, i) => {
        return total + i.Price
      }, 0)
    }
  },
  watch: {
    'modal.Type'(val) {
      this.modal.MaintainId = ''
      this.modal.OutId = ''
      this.modal.SupplierName = ''
      this.modal.entrySkuList = []
    },
    'modal.MaintainId'(val) {
      if (!val) return
      const index = this.maintainList.findIndex(_ => _.MaintainId === val)
      this.modal.entrySkuList = this.maintainList[index].ToolList.map(i => {
        return {
          SkuName: i.ProductName,
          SkuNo: i.SkuNo,
          SkuId: i.SkuId,
          Status: i.Status,
          Self: '',
          Room: '',
          Price: i.Price,
          OldPartId: '',
          ToolId: ''
        }
      })
    },
    'modal.OutId'(val) {
      const index = this.outList.findIndex(_ => _.Id === val)
      this.modal.entrySkuList = this.outList[index].skuList.map(i => {
        return {
          SkuName: i.SkuName,
          SkuNo: i.SkuNo,
          SkuId: i.SkuId,
          Status: i.Status,
          Self: i.AddressModel ? (i.AddressModel.Self || '') : '',
          Room: i.AddressModel ? (i.AddressModel.Room || '') : '',
          Price: i.Price,
          OldPartId: '',
          ToolId: ''
        }
      })
    },
    'value.SkuId'(val) {
      const index = this.spuList.findIndex(i => i.Id === val)
      if (index < 0) {
        this.AttrList = []
        this.value.SkuName = ''
        return
      }
      this.AttrList = this.spuList[index].AttrList
      this.value.SkuName = this.spuList[index].SkuName
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
    }
  },
  created() {
    this.getOutList()
    getMaintainAll().then(res => {
      this.maintainList = res.data
    })
    getList().then(res => {
      this.options = res.data
    })
  },
  methods: {
    updMain() {
      updEntry(this.modal).then(() => {
        this.success()
        this.$emit('handleSuccess')
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    getOutList() {
      getBad().then(res => {
        this.outList = res.data
      })
    },
    addItem() {
      this.$refs.valueForm.validate((valid) => {
        if (valid) {
          if (this.valueTitle === '添加入库信息') {
            this.modal.entrySkuList.push(this.value)
          }
          this.valueVisible = false
        }
      })
    },
    updItem() {
      this.$refs.valueForm.validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.valueTitle === '添加入库信息') {
            addSku({
              modelList: [
                {
                  SkuId: this.value.SkuId,
                  OldPartId: this.value.OldPartId,
                  ToolId: this.value.ToolId,
                  EntryId: this.modal.Id,
                  Price: this.value.Price,
                  Room: this.value.Room,
                  Self: this.value.Self,
                  Status: this.value.Status,
                  SkuNo: this.value.SkuNo
                }
              ],
              EntryNo: this.modal.EntryNo,
              EntryId: this.modal.Id,
              Type: this.modal.Type,
              OutId: this.modal.OutId,
              MaintainId: this.modal.MaintainId
            }).then(() => {
              this.success()
              this.$emit('handleSuccess')
              this.loading = false
              this.modal.entrySkuList.push(this.value)
            }).catch(() => {
              this.loading = false
            })
          } else {
            updSku({
              modelList: [
                {
                  EntryId: this.modal.Id,
                  Price: this.value.Price,
                  Room: this.value.Room,
                  Self: this.value.Self,
                  Status: this.value.Status,
                  SkuNo: this.value.SkuNo
                }
              ],
              EntryNo: this.modal.EntryNo,
              EntryId: this.modal.Id
            }).then(() => {
              this.success()
              this.$emit('handleSuccess')
              this.loading = false
              this.modal.entrySkuList.splice(this.updSkuIndex, 1, this.value)
            }).catch(() => {
              this.loading = false
            })
          }
          this.valueVisible = false
        }
      })
    },
    newItem() {
      this.valueVisible = true
      this.valueTitle = '添加入库信息'
      this.value = {
        SkuId: '',
        OldPartId: '',
        ToolId: '',
        EntryId: '',
        Price: 0,
        Room: '',
        Self: '',
        Status: 0,
        SkuNo: '',
        SkuName: ''
      }
    },
    handleDelete(index) {
      this.$confirm('确认删除?')
        .then(() => {
          this.modal.entrySkuList.splice(index, 1)
        })
        .catch(() => {})
    },
    delByServer(row, index) {
      this.$confirm('确认删除?(' + row.SkuNo + ')')
        .then(() => {
          this.loading = true
          delSku({
            modelList: [
              {
                SkuId: row.SkuId,
                SkuNo: row.SkuNo,
                Status: row.Status,
                OldPartId: row.OldPartId,
                ToolId: row.ToolId
              }
            ],
            EntryId: this.modal.Id,
            EntryNo: this.modal.EntryNo,
            Type: this.modal.Type,
            OutId: this.modal.OutId,
            MaintainId: this.modal.MaintainId
          }).then(() => {
            this.success()
            this.$emit('handleSuccess')
            this.loading = false
            this.modal.entrySkuList.splice(index, 1)
          }).catch(() => {
            this.loading = false
          })
        })
        .catch(() => {})
    },
    updByServer(row, index) {
      this.updSkuIndex = index
      this.valueVisible = true
      this.valueTitle = '更新入库信息'
      this.value = JSON.parse(JSON.stringify(row))
    },
    submit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.loading = true
          const obj = JSON.parse(JSON.stringify(this.modal))
          if (this.type === '新增') {
            addEntry(obj).then(() => {
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
      this.activeNames = ['1', '2']
      this.type = '新增'
      this.dialogVisible = true
      this.modal = {
        EntryNo: '',
        Operator: '',
        TotalPrice: 0,
        EntryDate: '',
        Batch: 0,
        SupplierName: '',
        Description: '',
        Type: 0,
        MaintainId: '',
        OutId: '',
        entrySkuList: []
      }
    },
    edit(row) {
      this.activeNames = ['1', '2']
      const obj = JSON.parse(JSON.stringify(row))
      this.type = '编辑'
      this.dialogVisible = true
      this.modal = obj
      this.modal.entrySkuList = this.modal.skuList.map(i => {
        return {
          SkuId: i.SkuId,
          OldPartId: i.OldPartId,
          ToolId: i.ToolId,
          EntryId: i.EntryId,
          Price: i.Price,
          Room: i.AddressModel.Room,
          Self: i.AddressModel.Self,
          Status: i.Status,
          SkuNo: i.SkuNo,
          SkuName: i.SkuName
        }
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
