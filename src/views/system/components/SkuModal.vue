<template>
  <el-dialog
    :title="type"
    :visible.sync="dialogVisible"
    :modal-append-to-body="false"
    width="50%"
  >
    <el-form ref="ruleForm" :model="modal" :rules="rule" label-width="80px">
      <el-form-item label="库存名称" prop="SkuName">
        <el-input v-model="modal.SkuName" />
      </el-form-item>
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
      <el-form-item v-show="!disable" label="标准产品">
        <el-select v-model="modal.SpuId" placeholder="请选择" style="width: 100%;">
          <el-option
            v-for="item in spuList"
            :key="item.Id"
            :label="item.AttrName"
            :value="item.Id + '***' + item.AttrName"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="库存描述">
        <el-input v-model="modal.Description" />
      </el-form-item>
      <el-form-item label="警报值">
        <el-input v-model="modal.Alarm" />
      </el-form-item>
      <el-form-item label="品牌">
        <el-input v-model="modal.Brand" />
      </el-form-item>
      <el-form-item label="单价">
        <el-input v-model="modal.Price" />
      </el-form-item>
      <el-form-item label="配件/工具">
        <el-select v-model="modal.Tool">
          <el-option :value="0" label="配件" />
          <el-option :value="1" label="工具" />
        </el-select>
      </el-form-item>
      <el-form-item label="新旧">
        <el-select v-model="modal.Status">
          <el-option :value="0" label="新" />
          <el-option :value="1" label="旧" />
        </el-select>
      </el-form-item>
      <el-card class="box-card">
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
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button
                type="danger"
                size="mini"
                @click="handleDelete(scope.$index)"
              >删除</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="Room"
            label="房间"
            width="180"
          />
          <el-table-column
            prop="Self"
            label="货架"
            width="180"
          />
          <el-table-column
            prop="Quantity"
            label="数量"
          />
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
      width="30%"
      center
    >
      <el-form>
        <el-form-item label="房间">
          <el-input v-model="value.Room" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="货架">
          <el-input v-model="value.Self" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="数量">
          <el-input v-model="value.Quantity" style="width: 100%;" />
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
import { getById } from '@/api/system/product'
import { addSku, updSku } from '@/api/system/sku'
import { getList, getListBy1 } from '@/api/category/catalog'
export default {
  data() {
    return {
      attrIndex: '',
      value: {
        Room: '',
        Self: '',
        Quantity: ''
      },
      valueVisible: false,
      dialogVisible: false,
      type: '',
      modal: {
        SkuName: '',
        Catalog2Id: '',
        Description: '',
        Alarm: '',
        Brand: '',
        Price: '',
        Tool: '',
        Status: '',
        addressList: []
      },
      loading: false,
      options: [],
      catalog1Id: '',
      rule: {
        SkuName: [{ required: true, message: '请输入库存名称', trigger: 'blur' }],
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
    }
  },
  watch: {
    catalog1Id(val) {
      this.modal.Catalog2Id = ''
      if (!val) {
        return
      }
      getListBy1({ Catalog1Id: val }).then(res => {
        this.catalogList = res.data
      })
    },
    'modal.Catalog2Id'(val) {
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
      if (this.valueTitle === '添加位置') {
        this.modal.addressList.push(this.value)
      } else {
        this.modal.addressList.splice(this.addrIndex, 1, this.value)
      }
      this.valueVisible = false
    },
    newAddr() {
      this.valueVisible = true
      this.valueTitle = '添加位置'
      this.value = {
        Room: '',
        Self: '',
        Quantity: ''
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
      this.loading = true
      if (this.type === '新增') {
        addSku(this.modal).then(() => {
          this.$emit('handleSuccess')
          this.loading = false
          this.dialogVisible = false
        }).catch(() => {
          this.loading = false
        })
      } else {
        updSku(this.modal).then(() => {
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
        SkuName: '',
        Catalog2Id: '',
        Description: '',
        Alarm: '',
        Brand: '',
        Price: '',
        Tool: '',
        Status: '',
        addressList: []
      }
    },
    edit(row) {
      this.type = '编辑'
      this.dialogVisible = true
      this.modal = row
    }
  }
}

</script>
