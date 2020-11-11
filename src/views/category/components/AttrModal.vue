<template>
  <el-dialog
    :title="type"
    :visible.sync="dialogVisible"
    width="50%"
  >
    <el-form ref="ruleForm" :model="attr" :rules="rule" label-width="120px">
      <el-form-item label="属性名称" prop="AttrName">
        <el-input v-model="attr.AttrName" />
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
      <el-form-item v-show="!disable" label="所属二级级目录" prop="CatalogId">
        <el-select v-model="attr.CatalogId" placeholder="请选择" style="width: 100%;">
          <el-option
            v-for="item in catalogList"
            :key="item.Id"
            :label="item.CatalogName"
            :value="item.Id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addAttr, updAttr } from '@/api/category/attr'
import { getList, getListBy1 } from '@/api/category/catalog'
export default {
  data() {
    return {
      dialogVisible: false,
      type: '',
      attr: {
        Id: '',
        AttrName: '',
        CatalogId: ''
      },
      index: '',
      loading: false,
      options: [],
      catalog1Id: '',
      rule: {
        AttrName: [{ required: true, message: '请输入属性名称', trigger: 'blur' }],
        CatalogId: [{ required: true, message: '请请选择目录', trigger: 'blur' }]
      },
      catalogList: []
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
    }
  },
  created() {
    getList().then(res => {
      this.options = res.data
    })
  },
  methods: {
    submit() {
      this.loading = true
      if (this.type === '新增') {
        addAttr({ AttrName: this.attr.AttrName,
          CatalogId: this.attr.CatalogId }).then(() => {
          this.$emit('handleSuccess', {}, 'add')
          this.loading = false
          this.dialogVisible = false
        }).catch(() => {
          this.loading = false
        })
      } else {
        updAttr(this.attr).then(() => {
          this.$emit('handleSuccess', this.attr, 'update', this.index)
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
      this.attr.Id = ''
      this.attr.AttrName = ''
      this.attr.CatalogId = ''
    },
    edit(row, index) {
      const obj = JSON.parse(JSON.stringify(row))
      this.type = '编辑'
      this.dialogVisible = true
      this.index = index
      this.attr.Id = obj.Id
      this.attr.AttrName = obj.AttrName
      this.attr.CatalogId = obj.CatalogId
    }
  }
}

</script>
