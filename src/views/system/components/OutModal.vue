<template>
  <el-dialog
    :title="type"
    :visible.sync="dialogVisible"
    :modal-append-to-body="false"
    width="60%"
  >
    <el-form ref="ruleForm" :model="modal" :rules="rule" label-width="100px">
      <el-col :span="12">
        <el-form-item v-show="disable" label="单号">
          <el-input v-model="modal.OutNo" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="操作员" prop="Operator">
          <el-input v-model="modal.Operator" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="批次" prop="Batch">
          <el-input-number v-model="modal.Batch" :step="1" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="客户">
          <el-input v-model="modal.ClientName" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="出库时间" prop="OutDate">
          <el-date-picker
            v-model="modal.OutDate"
            type="datetime"
            placeholder="选择日期时间"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 100%;"
            :picker-options="pickerOptions"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="总金额">
          <el-input-number v-model="modal.TotalPrice" disabled :precision="2" :step="1" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="备注">
          <el-input v-model="modal.Description" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" />
        </el-form-item>
      </el-col>

      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>库存信息</span>
          <el-button v-if="!disable" style="float: right; padding: 3px 0" type="text" @click="newItem">新增</el-button>
          <el-button v-if="status === 0 || status === 1" style="float: right; margin-left: 10px;" type="primary" @click="addItemModal">添加</el-button>
          <el-button v-if="(status === 0 || status === 2) && multipleSelection.length" style="float: right;" type="danger" @click="delItems">删除选中</el-button>
        </div>
        <el-table
          :data="modal.outSkuList"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            v-if="status === 0"
            type="selection"
            width="55"
          />
          <el-table-column align="left" label="操作">
            <template slot-scope="scope">
              <el-button
                v-if="!disable"
                type="danger"
                @click="handleDelete(scope.$index)"
              >删除</el-button>
              <el-button
                v-if="status === 0 || status === 2"
                type="danger"
                @click="delItem(scope.row)"
              >删除</el-button>
              <el-button
                v-if="status === 0"
                type="primary"
                @click="updItem(scope.row)"
              >更新</el-button>
            </template>
          </el-table-column>
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-tag>备注</el-tag>
              {{ scope.row.Remark }}
            </template>
          </el-table-column>
          <el-table-column
            prop="SkuNo"
            label="库存编号"
          />
          <el-table-column
            label="单价"
          >
            <template slot-scope="scope">
              {{ scope.row.Price | toMoney }}
            </template>
          </el-table-column>
          <el-table-column
            label="损坏状态"
          >
            <template slot-scope="scope">
              {{ scope.row.Status === 0 ? "正常" : scope.row.Status === 1 ? "待回收" : scope.row.Status === 2 ? "已回收" : "已丢弃" }}
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
            label="配件/工具"
          >
            <template slot-scope="scope">
              {{ scope.row.Tool === 0 ? "配件" : "工具" }}
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button v-if="!disable" type="primary" :loading="loading" @click="submit">确 定</el-button>
    </span>
    <el-dialog
      :title="valueTitle"
      :visible.sync="valueVisible"
      :append-to-body="true"
      width="600px"
      center
    >
      <el-form ref="valueForm" label-width="130px" style="padding: 20px;" :model="value" :rules="valueRule">
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
        <el-form-item v-show="!itemDisable" label="库存" prop="SkuId">
          <el-select v-model="value.SkuId" placeholder="请选择" style="width: 300px;">
            <el-option
              v-for="item in spuList"
              :key="item.Id"
              :label="item.SkuName + '(' + (item.Tool===0?'配件':'工具') + ')'"
              :value="item.Id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="位置" prop="AddressId">
          <el-select v-model="value.AddressId" :disabled="itemDisable" placeholder="请选择" style="width: 300px;">
            <!-- '房间'+item.Room+ '  货架'+ item.Self + '(' + (item.Status===0?'新':'旧') + ')' -->
            <el-option
              v-for="item in addrList"
              :key="item.Id"
              :label="item.SkuNo"
              :value="item.Id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="单价">
          <el-input-number v-model="value.Price" :precision="2" style="width: 300px;" :step="1" />
        </el-form-item>
        <!-- <el-form-item label="是否损坏" prop="IsBad">
          <el-select v-model="value.IsBad" style="width: 300px;">
            <el-option :value="1" label="损坏" />
            <el-option :value="0" label="正常" />
          </el-select>
        </el-form-item> -->
        <el-form-item label="备注" prop="Remark">
          <el-input
            v-model="value.Remark"
            style="width: 300px;"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8}"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="valueVisible = false">取 消</el-button>
        <el-button type="primary" @click="addItem">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="listVisible"
      :append-to-body="true"
      width="900px"
      center
    >
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>添加库存信息</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="newItem">新增</el-button>
        </div>
        <el-table
          :data="addList"
          style="width: 100%"
        >
          <el-table-column align="left" label="操作">
            <template slot-scope="scope">
              <el-button
                type="danger"
                @click="handleDeleteList(scope.$index)"
              >删除</el-button>
            </template>
          </el-table-column>
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-tag>备注</el-tag>
              {{ scope.row.Remark }}
            </template>
          </el-table-column>
          <el-table-column
            prop="SkuNo"
            label="库存编号"
          />
          <el-table-column
            label="单价"
          >
            <template slot-scope="scope">
              {{ scope.row.Price | toMoney }}
            </template>
          </el-table-column>
          <el-table-column
            label="是否坏件"
          >
            <template slot-scope="scope">
              {{ scope.row.Status === 1 ? "是" : "否" }}
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
            label="配件/工具"
          >
            <template slot-scope="scope">
              {{ scope.row.Tool === 0 ? "配件" : "工具" }}
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="listVisible = false">取 消</el-button>
        <el-button type="primary" @click="addItems">添 加</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="更新库存信息"
      :visible.sync="updVisible"
      :append-to-body="true"
      width="600px"
      center
    >
      <el-form label-width="130px" style="padding: 20px;" :model="updModal">
        <el-form-item label="损坏状态">
          <el-select v-model="updModal.IsBad" placeholder="请选择" style="width: 300px;">
            <el-option label="正常" :value="0" />
            <el-option label="待回收" :value="1" />
            <el-option label="已回收" :value="2" />
            <el-option label="已丢弃" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="Remark">
          <el-input
            v-model="updModal.Remark"
            style="width: 300px;"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8}"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updVisible = false">取 消</el-button>
        <el-button type="primary" @click="updItems">确 定</el-button>
      </span>
    </el-dialog>
  </el-dialog>
</template>

<script>
import { getSkuList } from '@/api/system/sku'
import { addOut, delItems, addItems, updItems } from '@/api/system/out'
import { getList, getListBy1 } from '@/api/category/catalog'
export default {
  data() {
    return {
      updModal: {
        IsBad: '',
        Remark: '',
        SkuNo: ''
      },
      updVisible: false,
      addList: [],
      listVisible: false,
      multipleSelection: [],
      status: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      attrIndex: '',
      value: {
        AddressId: '',
        SkuId: '',
        Price: '',
        Tool: '',
        Unit: '',
        Status: '',
        IsBad: 0,
        Remark: '',
        SkuNo: ''
      },
      valueVisible: false,
      dialogVisible: false,
      type: '',
      modal: {
        OutNo: '',
        Operator: '',
        TotalPrice: '',
        OutDate: '',
        Batch: '',
        ClientName: '',
        Description: '',
        outSkuList: []
      },
      loading: false,
      options: [],
      catalog1Id: '',
      Catalog2Id: '',
      valueRule: {
        AddressId: [{ required: true, message: '请选择位置', trigger: 'blur' }],
        SkuId: [{ required: true, message: '请选择库存', trigger: 'blur' }]
      },
      rule: {
        Operator: [{ required: true, message: '请输入操作员', trigger: 'blur' }],
        OutDate: [{ required: true, message: '请选择出库日期', trigger: 'blur' }],
        Batch: [{ required: true, message: '请输入批次', trigger: 'blur' }],
        ClientId: [{ required: true, message: '请选择客户', trigger: 'blur' }]
      },
      catalogList: [],
      spuList: [],
      valueTitle: '',
      addrIndex: '',
      addrList: []
    }
  },
  computed: {
    disable() {
      return this.type === '编辑'
    },
    itemDisable() {
      return (this.valueTitle === '修改出库信息')
    },
    entryTotal() {
      return this.modal.outSkuList.reduce((total, i) => {
        return total + i.Price
      }, 0)
    }
  },
  watch: {
    entryTotal(val) {
      this.modal.TotalPrice = val
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
      this.value.AddressId = ''
      if (val === '') {
        return
      }
      const index = this.spuList.findIndex(i => {
        return i.Id === val
      })
      if (index < 0) {
        this.value.Price = 0
        this.addrList = []
        this.value.Tool = ''
        this.value.Unit = ''
        return
      }
      this.value.Price = this.spuList[index].Price
      this.addrList = this.spuList[index].addressList
      this.value.Tool = this.spuList[index].Tool
      this.value.Unit = this.spuList[index].Unit
    },
    'value.AddressId'(val) {
      if (val === '') {
        return
      }
      const index = this.addrList.findIndex(i => {
        return i.Id === val
      })
      if (index < 0) {
        this.value.Status = ''
        this.value.SkuNo = ''
        return
      }
      this.value.Status = this.addrList[index].Status
      this.value.SkuNo = this.addrList[index].SkuNo
    },
    dialogVisible(val) {
      if (!val) {
        this.$emit('handleSuccess')
      }
    }
  },
  created() {
    getList().then(res => {
      this.options = res.data
    })
  },
  methods: {
    updItems() {
      this.$confirm('确认添加?')
        .then(() => {
          updItems({
            OutSkuList: [
              {
                SkuNo: this.updModal.SkuNo,
                IsBad: this.updModal.IsBad,
                Remark: this.updModal.Remark
              }
            ],
            OutId: this.modal.Id,
            OutNo: this.modal.OutNo
          }).then(() => {
            const index = this.modal.outSkuList.findIndex(_ => _.SkuNo === this.updModal.SkuNo)
            this.modal.outSkuList.splice(index, 1, this.updModal)
            this.updVisible = false
          })
        })
        .catch(() => {})
    },
    addItems() {
      this.$confirm('确认添加?')
        .then(() => {
          addItems({
            modelList: this.addList.map(_ => {
              return {
                SkuId: _.SkuId,
                Price: _.Price,
                Tool: _.Tool,
                Status: _.Status,
                IsBad: _.IsBad,
                Remark: _.Remark,
                SkuNo: _.SkuNo
              }
            }),
            OutId: this.modal.Id,
            OutNo: this.modal.OutNo
          }).then(() => {
            this.modal.outSkuList.push(...this.addList)
            this.success()
            this.listVisible = false
          })
        })
        .catch(() => {})
    },
    addItemModal() {
      this.listVisible = true
      this.addList = []
    },
    delItem(row) {
      this.$confirm('确认删除?(' + row.SkuNo + ')')
        .then(() => {
          delItems({
            modelList: [
              {
                SkuId: row.SkuId,
                SkuNo: row.SkuNo
              }
            ],
            OutId: this.modal.Id,
            OutNo: this.modal.OutNo
          }).then(() => {
            const index = this.modal.outSkuList.findIndex(_ => _.SkuNo === row.SkuNo)
            this.modal.outSkuList.splice(index, 1)
            this.success()
          })
        })
        .catch(() => {})
    },
    delItems() {
      this.$confirm('确认删除?')
        .then(() => {
          delItems({
            modelList: this.multipleSelection.map(_ => {
              return {
                SkuId: _.SkuId,
                SkuNo: _.SkuNo
              }
            }),
            OutId: this.modal.Id,
            OutNo: this.modal.OutNo
          }).then(() => {
            this.multipleSelection.forEach(i => {
              const index = this.modal.outSkuList.findIndex(_ => _.SkuNo === i.SkuNo)
              this.modal.outSkuList.splice(index, 1)
            })
            this.success()
          })
        })
        .catch(() => {})
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    updItem(row) {
      this.updVisible = true
      this.updModal = JSON.parse(JSON.stringify(row))
    },
    addItem() {
      this.$refs.valueForm.validate((valid) => {
        if (valid) {
          if (this.listVisible) {
            this.addList.push(this.value)
            this.valueVisible = false
            return
          }
          if (this.valueTitle === '添加出库信息') {
            this.modal.outSkuList.push(this.value)
          } else {
            this.modal.outSkuList.splice(this.addrIndex, 1, this.value)
          }
          this.valueVisible = false
        }
      })
    },
    newItem() {
      this.valueVisible = true
      this.valueTitle = '添加出库信息'
      this.value = {
        AddressId: '',
        SkuId: '',
        Price: '',
        Tool: '',
        Unit: '',
        Status: '',
        IsBad: 0,
        Remark: '',
        SkuNo: ''
      }
    },
    handleDelete(index) {
      this.$confirm('确认删除?')
        .then(() => {
          this.modal.outSkuList.splice(index, 1)
        })
        .catch(() => {})
    },
    handleDeleteList(index) {
      this.$confirm('确认删除?')
        .then(() => {
          this.addList.splice(index, 1)
        })
        .catch(() => {})
    },
    submit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.type === '新增') {
            addOut(this.modal).then(() => {
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
    add() {
      this.status = ''
      this.type = '新增'
      this.dialogVisible = true
      this.modal = {
        OutNo: '',
        Operator: '',
        TotalPrice: '',
        OutDate: '',
        Batch: '',
        ClientName: '',
        Description: '',
        outSkuList: []
      }
    },
    edit(row, status) {
      this.status = status
      const obj = JSON.parse(JSON.stringify(row))
      this.type = '编辑'
      this.dialogVisible = true
      this.modal = obj
      this.modal.outSkuList = this.modal.skuList.map(i => {
        return {
          Id: i.Id,
          AddressId: i.AddressId,
          SkuId: i.SkuId,
          Price: i.Price,
          Tool: i.Tool,
          Unit: i.Unit,
          Status: i.Status,
          IsBad: i.IsBad,
          Remark: i.Remark,
          SkuNo: i.SkuNo
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
