<template>
  <el-dialog
    :title="type"
    :visible.sync="dialogVisible"
    :modal-append-to-body="false"
    width="60%"
  >
    <el-form ref="ruleForm" :model="modal" :rules="rule" label-width="100px">
      <el-form-item v-show="!disable" label="单号">
        <el-input v-model="modal.OutNo" disabled />
      </el-form-item>
      <el-form-item label="操作员">
        <el-input v-model="modal.Operator" />
      </el-form-item>
      <el-form-item label="总金额">
        <el-input-number v-model="modal.TotalPrice" disabled :precision="2" :step="1" />
      </el-form-item>
      <el-form-item label="批次">
        <el-input-number v-model="modal.Batch" :step="1" />
      </el-form-item>
      <el-form-item label="客户编号">
        <el-input v-model="modal.ClientId" />
      </el-form-item>
      <el-form-item label="客户">
        <el-input v-model="modal.ClientName" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="modal.Description" />
      </el-form-item>
      <el-form-item label="出库时间">
        <el-date-picker
          v-model="modal.OutDate"
          type="datetime"
          placeholder="选择日期时间"
          style="width: 100%;"
          :picker-options="pickerOptions"
        />
      </el-form-item>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>库存信息</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="newItem">新增</el-button>
        </div>
        <el-table
          :data="modal.outSkuList"
          style="width: 100%"
        >
          <el-table-column align="left" width="180px" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button
                type="danger"
                size="mini"
                @click="handleDelete(scope.$index)"
              >删除</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="Quantity"
            label="数量"
          />
          <el-table-column
            label="总金额"
          >
            <template slot-scope="scope">
              {{ scope.row.TotalPrice | toMoney }}
            </template>
          </el-table-column>
          <el-table-column
            label="单价"
          >
            <template slot-scope="scope">
              {{ scope.row.Price | toMoney }}
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
      <el-button type="primary" :loading="loading" @click="submit">确 定</el-button>
    </span>
    <el-dialog
      :title="valueTitle"
      :visible.sync="valueVisible"
      :append-to-body="true"
      width="40%"
      center
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
              :label="item.SkuName"
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
        <el-form-item label="位置">
          <el-input v-model="value.AddressId" style="width: 300px;" />
        </el-form-item>
        <el-form-item label="总金额">
          <el-input-number v-model="value.TotalPrice" disabled :precision="2" style="width: 300px;" :step="1" />
        </el-form-item>
        <el-form-item label="新旧">
          <el-select v-model="value.Status" style="width: 300px;">
            <el-option :value="0" label="新" />
            <el-option :value="1" label="旧" />
          </el-select>
        </el-form-item>
        <el-form-item label="配件/工具">
          <el-select v-model="value.Tool" style="width: 300px;">
            <el-option :value="0" label="配件" />
            <el-option :value="1" label="工具" />
          </el-select>
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
import { getSkuList } from '@/api/system/sku'
import { addOut, updOut } from '@/api/system/out'
import { getList, getListBy1 } from '@/api/category/catalog'
export default {
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      attrIndex: '',
      value: {
        SkuId: '',
        Quantity: '',
        Price: '',
        AddressId: '',
        TotalPrice: '',
        Tool: '',
        Status: ''
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
        ClientId: '',
        ClientName: '',
        Description: '',
        outSkuList: []
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
      addrIndex: ''
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
      return this.modal.outSkuList.reduce((total, i) => {
        return total + i.TotalPrice
      }, 0)
    },
    itemTotal() {
      return this.value.Quantity * this.value.Price
    }
  },
  watch: {
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
    getList().then(res => {
      this.options = res.data
    })
  },
  methods: {
    handleEdit(index, row) {
      this.addrIndex = index
      this.value = row
      this.valueVisible = true
      this.valueTitle = '修改入库信息'
    },
    addItem() {
      if (this.valueTitle === '添加入库信息') {
        this.modal.outSkuList.push(this.value)
      } else {
        this.modal.outSkuList.splice(this.addrIndex, 1, this.value)
      }
      this.valueVisible = false
    },
    newItem() {
      this.valueVisible = true
      this.valueTitle = '添加入库信息'
      this.value = {
        SkuId: '',
        Quantity: '',
        Price: '',
        AddressId: '',
        TotalPrice: '',
        Tool: '',
        Status: null
      }
    },
    handleDelete(index) {
      this.$confirm('确认删除?')
        .then(() => {
          this.modal.outSkuList.splice(index, 1)
        })
        .catch(() => {})
    },
    submit() {
      this.loading = true
      if (this.type === '新增') {
        addOut(this.modal).then(() => {
          this.$emit('handleSuccess')
          this.loading = false
          this.dialogVisible = false
        }).catch(() => {
          this.loading = false
        })
      } else {
        updOut(this.modal).then(() => {
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
        OutNo: '',
        Operator: '',
        TotalPrice: '',
        OutDate: '',
        Batch: '',
        ClientId: '',
        ClientName: '',
        Description: '',
        outSkuList: []
      }
    },
    edit(row) {
      this.type = '编辑'
      this.dialogVisible = true
      this.modal = row
      this.modal.outSkuList = this.modal.skuList.map(i => {
        return {
          SkuId: i.SkuId,
          Quantity: i.TotalCount,
          Price: i.Price,
          AddressId: i.AddressId,
          TotalPrice: i.TotalCount * i.Price,
          Tool: i.Tool,
          Status: null
        }
      })
    }
  }
}

</script>
