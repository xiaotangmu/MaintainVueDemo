<template>
  <el-dialog
    :title="type"
    :visible.sync="dialogVisible"
    :modal-append-to-body="false"
    width="70%"
  >
    <el-form ref="ruleForm" :model="modal" :rules="rule" label-width="100px">
      <el-row>
        <el-col :span="24">
          <el-form-item v-show="false" label="单号">
            <el-input v-model="modal.EntryNo" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="操作员">
            <el-input v-model="modal.Operator" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="批次">
            <el-input-number v-model="modal.Batch" :step="1" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="来源">
            <el-select v-model="modal.IsMaintain" :disabled="disable">
              <el-option :value="0" label="供应商" />
              <el-option :value="1" label="维修单" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-show="modal.IsMaintain === 0" label="供应商编号">
            <el-input v-model="modal.SupplierId" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-show="modal.IsMaintain === 0" label="供应商">
            <el-input v-model="modal.SupplierName" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-show="modal.IsMaintain === 1" label="维修单">
            <el-select v-model="modal.maintainShowModel.MaintainNo" placeholder="请选择" :disabled="disable">
              <el-option
                v-for="item in maintainList"
                :key="item.Id"
                :label="item.MaintainNo"
                :value="item.Id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-show="modal.IsMaintain === 1" label="维修单公司">
            <el-input v-model="modal.maintainShowModel.CompanyName" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-show="modal.IsMaintain === 1" label="车牌号">
            <el-input v-model="modal.maintainShowModel.CarLicense" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-show="modal.IsMaintain === 1" label="车型">
            <el-input v-model="modal.maintainShowModel.Type" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-show="modal.IsMaintain === 1" label="开始时间">
            <el-date-picker
              v-model="modal.maintainShowModel.StartDate"
              disabled
              type="datetime"
              placeholder="选择日期时间"
              style="width: 100%;"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-show="modal.IsMaintain === 1" label="归还时间">
            <el-date-picker
              v-model="modal.maintainShowModel.ReturnDate"
              disabled
              type="datetime"
              placeholder="选择日期时间"
              style="width: 100%;"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注">
            <el-input v-model="modal.Description" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入库时间">
            <el-date-picker
              v-model="modal.EntryDate"
              type="datetime"
              placeholder="选择日期时间"
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
      </el-row>

      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>库存信息</span>
          <el-button v-show="modal.IsMaintain !== 1" style="float: right; padding: 3px 0" type="text" @click="newItem">新增</el-button>
        </div>
        <el-table
          :data="modal.entrySkuList"
          style="width: 100%"
        >
          <el-table-column v-if="modal.IsMaintain !== 1 || !disable" align="left" width="180px" label="操作">
            <template slot-scope="scope">
              <el-button
                v-show="!scope.row.disabled "
                type="danger"
                size="mini"
                @click="handleDelete(scope.$index)"
              >删除</el-button>
              <el-button
                type="primary"
                size="mini"
                @click="selectAddr(scope.row)"
              >选择位置</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="SkuName"
            label="库存名"
          />
          <el-table-column
            label="位置"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.AddressId === '' ? '未选择' : '已选择' }}
            </template>
          </el-table-column>
          <el-table-column
            label="数量"
            width="300px"
            align="center"
          >
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.Quantity" :disabled="modal.IsMaintain === 1 && disable" :step="1" :max="scope.row.maxNum" />
            </template>
          </el-table-column>
          <el-table-column
            label="单价"
            width="300px"
            align="center"
          >
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.Price" :precision="2" :step="1" />
            </template>
          </el-table-column>
          <el-table-column
            label="总金额"
          >
            <template slot-scope="scope">
              {{ scope.row.TotalPrice = scope.row.Quantity * scope.row.Price | toMoney }}
            </template>
          </el-table-column>
          <el-table-column
            label="新旧"
          >
            <template slot-scope="scope">
              {{ scope.row.Status === 0 ? "新" : "旧" }}
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="submit">确 定</el-button>
    </span>
    <el-dialog
      :title="valueTitle"
      :visible.sync="valueVisible"
      :append-to-body="true"
      width="40%"
    >
      <el-form label-width="80px" style="padding: 20px;">
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
        <el-form-item v-show="!itemDisable" label="库存">
          <el-select v-model="value.SkuId" placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="item in spuList"
              :key="item.Id"
              :label="item.SkuName + '(' + (item.Tool===0?'配件':'工具') + ')'"
              :value="item.Id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="位置">
          <el-select v-model="value.AddressId" :disabled="itemDisable" placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="item in addrList"
              :key="item.Id"
              :label="'房间'+item.Room+ '  货架'+ item.Self + '(' + (item.Status===0?'新':'旧') + ')'"
              :value="item.Id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="数量">
          <el-input-number v-model="value.Quantity" style="width: 300px;" :step="1" />
        </el-form-item>
        <el-form-item label="单价">
          <el-input-number v-model="value.Price" :precision="2" style="width: 300px;" :step="1" />
        </el-form-item>
        <el-form-item label="总金额">
          <el-input-number v-model="value.TotalPrice" disabled :precision="2" style="width: 300px;" :step="1" />
        </el-form-item>
        <!-- <el-form-item label="新旧">
          <el-select v-model="value.Status" disabled style="width: 300px;">
            <el-option :value="0" label="新" />
            <el-option :value="1" label="旧" />
          </el-select>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="valueVisible = false">取 消</el-button>
        <el-button type="primary" @click="addItem">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="选择位置"
      :visible.sync="addrVisible"
      :append-to-body="true"
      width="40%"
    >
      <el-select v-model="selectItem.AddressId" placeholder="请选择" style="width: 100%;">
        <el-option
          label="空"
          :value="''"
        />
        <el-option
          v-for="item in addrListById"
          :key="item.Id"
          :label="'房间' + item.Room + ' 货架' + item.Self + '(' + (item.Status===0?'新':'旧') + ')'"
          :value="item.Id"
        />
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addrVisible = false">确认</el-button>
      </span>
    </el-dialog>
  </el-dialog>
</template>

<script>
import { getSkuList, getAddrList } from '@/api/system/sku'
import { addEntry, updEntry } from '@/api/system/entry'
import { getMaintainAll } from '@/api/system/maintain'
import { getList, getListBy1 } from '@/api/category/catalog'
export default {
  data() {
    return {
      addrListById: [],
      addrVisible: false,
      selectItem: {},
      toolList: [],
      oldPartList: [],
      maintainList: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      attrIndex: '',
      value: {
        SkuId: '',
        SkuName: '',
        Quantity: '',
        Price: '',
        AddressId: '',
        TotalPrice: '',
        OldPartId: '',
        ToolId: '',
        Status: null
      },
      valueVisible: false,
      dialogVisible: false,
      type: '',
      modal: {
        EntryNo: '',
        Operator: '',
        TotalPrice: '',
        EntryDate: '',
        Batch: '',
        SupplierId: '',
        SupplierName: '',
        Description: '',
        entrySkuList: [],
        maintainShowModel: {
          MaintainNo: '',
          CompanyName: '',
          CarLicense: '',
          Type: '',
          StartDate: '',
          ReturnDate: ''
        },
        IsMaintain: 0,
        MaintainId: ''
      },
      loading: false,
      options: [],
      catalog1Id: '',
      Catalog2Id: '',
      rule: {
        Catalog2Id: [{ required: true, message: '请请选择目录', trigger: 'blur' }]
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
      return this.valueTitle === '修改入库信息'
    },
    entryTotal() {
      return this.modal.entrySkuList.reduce((total, i) => {
        return total + i.TotalPrice
      }, 0)
    },
    itemTotal() {
      return this.value.Quantity * this.value.Price
    }
  },
  watch: {
    'modal.maintainShowModel.MaintainNo'(val) {
      if (!val || this.disable) {
        return
      }
      const index = this.maintainList.findIndex(i => i.Id === val)
      if (index < 0) {
        this.modal.maintainShowModel.CompanyName = ''
        this.modal.maintainShowModel.CarLicense = ''
        this.modal.maintainShowModel.Type = ''
        this.modal.maintainShowModel.StartDate = ''
        this.modal.maintainShowModel.ReturnDate = ''
        this.toolList = []
        this.oldPartList = []
        return
      }
      this.modal.maintainShowModel.CompanyName = this.maintainList[index].CompanyName
      this.modal.maintainShowModel.CarLicense = this.maintainList[index].CarLicense
      this.modal.maintainShowModel.Type = this.maintainList[index].Type
      this.modal.maintainShowModel.StartDate = this.maintainList[index].StartDate
      this.modal.maintainShowModel.ReturnDate = this.maintainList[index].ReturnDate
      this.toolList = this.maintainList[index].ToolList
      this.oldPartList = this.maintainList[index].OldPartList
      this.modal.entrySkuList = this.toolList.map(i => {
        return {
          SkuName: i.SkuName,
          SkuId: i.SkuId,
          Quantity: 0,
          Price: i.Price || 0,
          AddressId: '',
          TotalPrice: 0,
          OldPartId: '',
          ToolId: i.Id,
          Status: 2,
          maxNum: i.Num - i.DealNum,
          disabled: true
        }
      }).concat(this.oldPartList.map(i => {
        return {
          SkuName: i.SkuName,
          SkuId: i.SkuId,
          Quantity: 0,
          Price: i.Price || 0,
          AddressId: '',
          TotalPrice: 0,
          OldPartId: i.Id,
          ToolId: '',
          Status: 1,
          maxNum: i.Num - i.DealNum,
          disabled: true
        }
      }))
      this.modal.MaintainId = this.maintainList[index].Id
    },
    'modal.IsMaintain'(val) {
      if (val === 1) {
        this.modal.SupplierId = ''
        this.modal.SupplierName = ''
      } else {
        this.modal.maintainShowModel = {
          MaintainNo: '',
          CompanyName: '',
          CarLicense: '',
          Type: '',
          StartDate: '',
          ReturnDate: ''
        }
      }
    },
    'value.SkuId'(val) {
      this.value.AddressId = ''
      const index = this.spuList.findIndex(i => i.Id === val)
      if (index < 0) {
        this.addrList = []
        this.value.SkuName = ''
        return
      }
      this.addrList = this.spuList[index].addressList.filter(i => i.Status === 0)
      this.value.SkuName = this.spuList[index].SkuName
    },
    'value.AddressId'(val) {
      this.value.Status = ''
      const index = this.addrList.findIndex(i => i.Id === val)
      if (index < 0) {
        return
      }
      this.value.Status = this.addrList[index].Status
    },
    itemTotal(val) {
      this.value.TotalPrice = val
    },
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
    }
  },
  created() {
    getMaintainAll().then(res => {
      this.maintainList = res.data
    })
    getList().then(res => {
      this.options = res.data
    })
  },
  methods: {
    selectAddr(row) {
      this.addrVisible = true
      this.selectItem = row
      getAddrList({ Id: row.SkuId }).then(res => {
        this.addrListById = res.data
      }).catch(() => {
        this.addrListById = []
      })
    },
    addItem() {
      if (this.valueTitle === '添加入库信息') {
        this.modal.entrySkuList.push(this.value)
      } else {
        this.modal.entrySkuList.splice(this.addrIndex, 1, this.value)
      }
      this.valueVisible = false
    },
    newItem() {
      this.valueVisible = true
      this.valueTitle = '添加入库信息'
      this.value = {
        SkuName: '',
        SkuId: '',
        Quantity: '',
        Price: '',
        AddressId: '',
        TotalPrice: '',
        OldPartId: '',
        ToolId: '',
        Status: null
      }
    },
    handleDelete(index) {
      this.$confirm('确认删除?')
        .then(() => {
          this.modal.entrySkuList.splice(index, 1)
        })
        .catch(() => {})
    },
    submit() {
      this.loading = true
      const obj = JSON.parse(JSON.stringify(this.modal))
      obj.entrySkuList = obj.entrySkuList.filter(i => i.AddressId !== '')
      if (this.type === '新增') {
        addEntry(obj).then(() => {
          this.success()
          this.$emit('handleSuccess')
          this.loading = false
          this.dialogVisible = false
        }).catch(() => {
          this.loading = false
        })
      } else {
        updEntry(obj).then(() => {
          this.success()
          this.$emit('handleSuccess')
          this.loading = false
          this.dialogVisible = false
        }).catch(() => {
          this.loading = false
        })
      }
    },
    add() {
      this.type = '新增'
      this.dialogVisible = true
      this.modal = {
        EntryNo: '',
        Operator: '',
        TotalPrice: '',
        EntryDate: '',
        Batch: '',
        SupplierId: '',
        SupplierName: '',
        Description: '',
        entrySkuList: [],
        maintainShowModel: {
          MaintainNo: '',
          CompanyName: '',
          CarLicense: '',
          Type: '',
          StartDate: '',
          ReturnDate: ''
        },
        IsMaintain: 0,
        MaintainId: ''
      }
    },
    edit(row) {
      const obj = JSON.parse(JSON.stringify(row))
      this.type = '编辑'
      this.dialogVisible = true
      this.modal = obj
      this.modal.entrySkuList = this.modal.skuList.map(i => {
        return {
          SkuName: i.SkuName,
          SkuId: i.SkuId,
          Quantity: i.TotalCount,
          Price: i.Price,
          AddressId: i.AddressId,
          TotalPrice: i.TotalCount * i.Price,
          OldPartId: '',
          ToolId: '',
          Status: i.Status
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
