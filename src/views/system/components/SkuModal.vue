<template>
  <el-dialog
    :title="type"
    :visible.sync="dialogVisible"
    :modal-append-to-body="false"
    width="70%"
  >
    <el-form ref="ruleForm" :model="modal" :rules="rule" label-width="120px">
      <!-- <el-form-item label="库存名">
        <el-input v-model="modal.SkuName" disabled />
      </el-form-item> -->
      <el-row>
        <el-col :span="12">
          <el-form-item v-show="!disable" label="所属一级目录">
            <el-select v-model="catalog1Id" placeholder="请选择" style="width: 100%;">
              <el-option
                v-for="item in options"
                :key="item.Id"
                :label="item.CatalogName"
                :value="item.Id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-show="!disable" label="所属二级级目录" prop="Catalog2Id">
            <el-select v-model="modal.Catalog2Id" placeholder="请选择" style="width: 100%;">
              <el-option
                v-for="item in catalogList"
                :key="item.Id"
                :label="item.CatalogName"
                :value="item.Id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-show="!disable" label="标准产品" prop="SpuId">
            <el-select v-model="modal.SpuId" placeholder="请选择" style="width: 100%;">
              <el-option
                v-for="item in spuList"
                :key="item.Id"
                :label="item.ProductName"
                :value="item.Id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="库存描述">
            <el-input v-model="modal.Description" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="警报值">
            <el-input v-model="modal.Alarm" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="品牌">
            <el-input v-model="modal.Brand" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="参考价格">
            <el-input-number v-model="modal.Price" :precision="2" :step="1" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="配件/工具" prop="Tool">
            <el-select v-model="modal.Tool">
              <el-option :value="0" label="配件" />
              <el-option :value="1" label="工具" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="总数">
            <el-input-number v-model="modal.TotalCount" disabled :step="1" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-collapse v-model="activeNames" style="padding: 0 20px;">
          <el-collapse-item title="属性" name="1">
            <div v-for="i in attrList" :key="i.AttrName">
              {{ i.AttrName }}:
              <el-checkbox-group v-model="checkedAttrs">
                <el-checkbox
                  v-for="j in i.ValueList"
                  :key="j.Value"
                  :label="JSON.stringify({ AttrName: i.AttrName,
                                           SpuAttrValueId: j.Id,
                                           Value: j.Value })"
                >{{ j.Value }}</el-checkbox>
              </el-checkbox-group>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-row>

      <el-card class="box-card" style="width: 100%;">
        <div slot="header" class="clearfix">
          <span>位置列表</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="newAddr">新增</el-button>
        </div>
        <el-table
          :data="modal.addressList"
          style="width: 100%"
        >
          <el-table-column align="left" width="180px" label="操作">
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button
                type="danger"
                @click="handleDelete(scope.$index)"
              >删除</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="Room"
            label="房间"
          />
          <el-table-column
            prop="Self"
            label="货架"
          />
          <el-table-column
            prop="Quantity"
            label="数量"
          />
          <el-table-column
            label="单价"
          >
            <template slot-scope="scope">
              {{ scope.row.Price | toMoney }}
            </template>
          </el-table-column>
          <el-table-column label="新旧">
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
      width="33%"
      center
    >
      <el-form ref="valueForm" label-width="80px" :model="value" :rules="valueRule">
        <el-form-item label="房间" prop="Room">
          <el-input v-model="value.Room" style="width: 300px;" />
        </el-form-item>
        <el-form-item label="货架" prop="Self">
          <el-input v-model="value.Self" style="width: 300px;" />
        </el-form-item>
        <el-form-item label="数量">
          <el-input-number v-model="value.Quantity" :step="1" />
        </el-form-item>
        <el-form-item label="参考价格">
          <el-input-number v-model="value.Price" :precision="2" :step="1" />
        </el-form-item>
        <el-form-item label="新旧" prop="Status">
          <el-select v-model="value.Status" style="width: 300px;">
            <el-option :value="0" label="新" />
            <el-option :value="1" label="旧" />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="valueVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAddr">确 定</el-button>
      </span>
    </el-dialog>
  </el-dialog>
</template>

<script>
import { getById, getAttrList } from '@/api/system/product'
import { addSku, updSku } from '@/api/system/sku'
import { getList, getListBy1 } from '@/api/category/catalog'
export default {
  data() {
    return {
      checkedAttrs: [],
      activeNames: ['1'],
      attrIndex: '',
      value: {
        Room: '',
        Self: '',
        Quantity: '',
        Price: '',
        Status: null
      },
      valueVisible: false,
      dialogVisible: false,
      type: '',
      modal: {
        SpuId: '',
        Catalog2Id: '',
        Description: '',
        Alarm: '',
        Brand: '',
        Price: '',
        Tool: '',
        TotalCount: 20,
        AttrList: [],
        addressList: []
      },
      loading: false,
      options: [],
      catalog1Id: '',
      valueRule: {
        Room: [{ required: true, message: '请输入房间号', trigger: 'blur' }],
        Self: [{ required: true, message: '请输入货架号', trigger: 'blur' }],
        Status: [{ required: true, message: '请选择新旧状态', trigger: 'blur' }]
      },
      rule: {
        Catalog2Id: [{ required: true, message: '请选择目录', trigger: 'blur' }],
        SpuId: [{ required: true, message: '请选择产品', trigger: 'blur' }],
        Tool: [{ required: true, message: '请选择产品类型(配件/工具)', trigger: 'blur' }]
      },
      catalogList: [],
      spuList: [],
      valueTitle: '',
      addrIndex: '',
      attrList: []
    }
  },
  computed: {
    disable() {
      return this.type === '编辑'
    },
    totalCount() {
      return this.modal.addressList.reduce((total, item) => {
        return total + item.Quantity
      }, 0)
    }
  },
  watch: {
    checkedAttrs: {
      handler(val) {
        this.modal.AttrList = val.map(_ => {
          _ = JSON.parse(_)
          return {
            AttrName: _.AttrName,
            SpuAttrValueId: _.SpuAttrValueId,
            Value: _.Value
          }
        })
      },
      immediate: true,
      deep: true
    },
    totalCount(val) {
      this.modal.TotalCount = val
    },
    'modal.SpuId'(val) {
      if (!val) {
        return
      }
      this.spuList.forEach(i => {
        if (val === i.Id) {
          this.modal.SkuName = i.ProductName
        }
      })
      getAttrList({ spuId: val }).then(res => {
        this.attrList = res.data
      })
    },
    catalog1Id(val) {
      if (this.type === '编辑') {
        return
      }
      this.modal.Catalog2Id = ''
      if (!val) {
        return
      }
      getListBy1({ Catalog1Id: val }).then(res => {
        this.catalogList = res.data
      })
    },
    'modal.Catalog2Id'(val) {
      if (this.type === '编辑') {
        return
      }
      this.modal.SpuId = ''
      if (!val) {
        return
      }
      getById({ Catalog2Id: val }).then(res => {
        this.spuList = res.data
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
      this.valueTitle = '修改位置'
    },
    addAddr() {
      this.$refs.valueForm.validate((valid) => {
        if (valid) {
          if (this.valueTitle === '添加位置') {
            this.modal.addressList.push(this.value)
          } else {
            this.modal.addressList.splice(this.addrIndex, 1, this.value)
          }
          this.valueVisible = false
        }
      })
    },
    newAddr() {
      this.valueVisible = true
      this.valueTitle = '添加位置'
      this.value = {
        Room: '',
        Self: '',
        Quantity: '',
        Price: '',
        Status: null
      }
    },
    handleDelete(index) {
      this.$confirm('确认删除?')
        .then(() => {
          this.modal.addressList.splice(index, 1)
        })
        .catch(() => {})
    },
    submit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.type === '新增') {
            addSku(this.modal).then(() => {
              this.success()
              this.$emit('handleSuccess')
              this.loading = false
              this.dialogVisible = false
            }).catch(() => {
              this.loading = false
            })
          } else {
            updSku(this.modal).then(() => {
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
      this.type = '新增'
      this.dialogVisible = true
      this.checkedAttrs = []
      this.modal = {
        SpuId: '',
        Catalog2Id: '',
        Description: '',
        Alarm: '',
        Brand: '',
        Price: '',
        Tool: '',
        attrList: [],
        addressList: []
      }
    },
    edit(row) {
      const obj = JSON.parse(JSON.stringify(row))
      this.type = '编辑'
      this.dialogVisible = true
      this.modal = obj
      this.checkedAttrs = this.modal.AttrList.map(_ => {
        return JSON.stringify({
          AttrName: _.AttrName,
          SpuAttrValueId: _.SpuAttrValueId,
          Value: _.Value
        })
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
