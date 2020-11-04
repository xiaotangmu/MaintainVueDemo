<template>
  <el-dialog
    :title="type"
    :visible.sync="dialogVisible"
    :modal-append-to-body="false"
    width="50%"
  >
    <el-form ref="ruleForm" :model="spu" :rules="rule" label-width="80px">
      <el-form-item label="产品名称" prop="ProductName">
        <el-input v-model="spu.ProductName" />
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
        <el-select v-model="spu.Catalog2Id" placeholder="请选择" style="width: 100%;">
          <el-option
            v-for="item in catalogList"
            :key="item.Id"
            :label="item.CatalogName"
            :value="item.Id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="产品描述">
        <el-input v-model="spu.Description" />
      </el-form-item>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>属性列表</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="newAttr">新增</el-button>
        </div>
        <div v-for="(attrItem, index) in spu.SpuAttrModelList" :key="attrItem.Id" class="clearfix" style="position: relative;padding: 5px;">
          {{ attrItem.AttrName }}:
          <el-tag style="margin-right: 5px; cursor: pointer;" @click="newAttrValue(index)">+</el-tag>
          <el-tag v-for="(j, valueIndex) in attrItem.ValueList" :key="j.Id" style="margin-right: 5px;" type="primary" closable @close="delAttrValue(valueIndex)">
            {{ j.Value }}
          </el-tag>
          <el-button type="danger" style="float: right;" @click="delAttrItem(index)">删除</el-button>
        </div>
      </el-card>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="submit">确 定</el-button>
    </span>
    <el-dialog
      :title="attrTitle"
      :visible.sync="attrVisible"
      :append-to-body="true"
      width="30%"
      center
    >
      <el-form>
        <el-form-item label="所属一级目录">
          <el-select v-model="attr.Catalog1Id" placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="item in options"
              :key="item.Id"
              :label="item.CatalogName"
              :value="item.Id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属二级级目录">
          <el-select v-model="attr.Catalog2Id" placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="item in attrCatalogList"
              :key="item.Id"
              :label="item.CatalogName"
              :value="item.Id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="属性名称">
          <el-select v-model="attr.AttrId" placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="item in attrList"
              :key="item.Id"
              :label="item.AttrName"
              :value="item.Id + '***' + item.AttrName"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="attrVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAttrItem">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="添加属性值"
      :visible.sync="valueVisible"
      :append-to-body="true"
      width="30%"
      center
    >
      <el-form>
        <el-form-item label="属性值">
          <el-input v-model="value" style="width: 100%;" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="valueVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAttrValue">确 定</el-button>
      </span>
    </el-dialog>
  </el-dialog>
</template>

<script>
import { addSpu, updSpu } from '@/api/system/product'
import { getAttrList } from '@/api/category/attr'
import { getList, getListBy1 } from '@/api/category/catalog'
export default {
  data() {
    return {
      attrIndex: '',
      value: '',
      valueVisible: false,
      attrTitle: '',
      attrVisible: false,
      dialogVisible: false,
      type: '',
      spu: {
        ProductName: '',
        Catalog2Id: '',
        Description: '',
        SpuAttrModelList: []
      },
      attr: {
        Catalog1Id: '',
        Catalog2Id: '',
        AttrId: ''
      },
      loading: false,
      options: [],
      catalog1Id: '',
      rule: {
        ProductName: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
        Catalog2Id: [{ required: true, message: '请请选择目录', trigger: 'blur' }]
      },
      catalogList: [],
      attrCatalogList: [],
      attrList: []
    }
  },
  computed: {
    disable() {
      return this.type === '编辑'
    }
  },
  watch: {
    catalog1Id(val) {
      getListBy1({ Catalog1Id: val }).then(res => {
        this.catalogList = res.data
      })
    },
    'attr.Catalog1Id'(val) {
      this.attr.Catalog2Id = ''
      if (!val) {
        return
      }
      getListBy1({ Catalog1Id: val }).then(res => {
        this.attrCatalogList = res.data
      })
    },
    'attr.Catalog2Id'(val) {
      this.attr.AttrId = ''
      if (!val) {
        return
      }
      getAttrList({ catalogId: val }).then(res => {
        this.attrList = res.data
      })
    }
  },
  created() {
    getList().then(res => {
      this.options = res.data
    })
  },
  methods: {
    delAttrValue(index) {
      this.spu.SpuAttrModelList[this.attrIndex].ValueList.splice(index, 1)
    },
    addAttrValue() {
      this.spu.SpuAttrModelList[this.attrIndex].ValueList.push({
        Value: this.value
      })
      this.valueVisible = false
    },
    newAttrValue(index) {
      this.value = ''
      this.valueVisible = true
      this.attrIndex = index
    },
    delAttrItem(index) {
      this.$confirm('确认删除?')
        .then(() => {
          this.spu.SpuAttrModelList.splice(index, 1)
        })
        .catch(() => {})
    },
    addAttrItem() {
      this.spu.SpuAttrModelList.push({
        ValueList: [],
        AttrId: this.attr.AttrId.split('***')[0],
        AttrName: this.attr.AttrId.split('***')[1]
      })
      this.attrVisible = false
    },
    newAttr() {
      this.attrTitle = '新增属性'
      this.attrVisible = true
    },
    submit() {
      this.loading = true
      if (this.type === '新增') {
        addSpu(this.spu).then(() => {
          this.$emit('handleSuccess')
          this.loading = false
          this.dialogVisible = false
        }).catch(() => {
          this.loading = false
        })
      } else {
        updSpu(this.spu).then(() => {
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
      this.spu = {
        ProductName: '',
        Catalog2Id: '',
        Description: '',
        SpuAttrModelList: []
      }
    },
    edit(row) {
      this.type = '编辑'
      this.dialogVisible = true
      this.spu = row
    }
  }
}

</script>
