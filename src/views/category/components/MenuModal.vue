<template>
  <el-dialog
    :title="type"
    :visible.sync="dialogVisible"
    width="50%"
  >
    <el-form ref="ruleForm" :model="catalog" label-width="120px">
      <el-form-item label="层级">
        <el-select v-model="nested" :disabled="disable" placeholder="请选择" style="width: 100%;">
          <el-option
            label="一级目录"
            :value="1"
          />
          <el-option
            label="二级目录"
            :value="2"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="nested === 2" label="所属一级目录">
        <el-select v-model="catalog.Catalog1Id" :disabled="disable" placeholder="请选择" style="width: 100%;">
          <el-option
            v-for="item in options"
            :key="item.Id"
            :label="item.CatalogName"
            :value="item.Id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="目录名称">
        <el-input v-model="catalog.CatalogName" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getList, addCatalog1, addCatalog2, updateCatalog1, updateCatalog2 } from '@/api/category/catalog'
export default {
  data() {
    return {
      dialogVisible: false,
      type: '',
      nested: 1,
      catalog: {
        Id: '',
        CatalogName: '',
        Catalog1Id: ''
      },
      options: [],
      loading: false
    }
  },
  computed: {
    disable() {
      return this.type === '编辑'
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
        if (this.nested === 1) {
          addCatalog1({ CatalogName: this.catalog.CatalogName }).then(() => {
            this.success()
          }).catch(() => {
            this.loading = false
          })
        } else {
          addCatalog2({ CatalogName: this.catalog.CatalogName, Catalog1Id: this.catalog.Catalog1Id }).then(() => {
            this.success()
          }).catch(() => {
            this.loading = false
          })
        }
      } else {
        if (this.nested === 1) {
          updateCatalog1({ CatalogName: this.catalog.CatalogName, Id: this.catalog.Id }).then(() => {
            this.success()
          }).catch(() => {
            this.loading = false
          })
        } else {
          updateCatalog2({ CatalogName: this.catalog.CatalogName, Catalog1Id: this.catalog.Catalog1Id, Id: this.catalog.Id }).then(() => {
            this.success()
          }).catch(() => {
            this.loading = false
          })
        }
      }
    },
    success() {
      this.$emit('handleSuccess')
      this.loading = false
      this.dialogVisible = false
    },
    getValue(value) {
      this.menu.parent = value
    },
    add() {
      this.type = '新增'
      this.nested = 1
      this.dialogVisible = true
      this.catalog.Id = ''
      this.catalog.CatalogName = ''
      this.catalog.Catalog1Id = ''
    },
    edit(row) {
      const obj = JSON.parse(JSON.stringify(row))
      this.type = '编辑'
      this.nested = obj.Catalog1Id ? 2 : 1
      this.dialogVisible = true
      this.catalog.Id = obj.Id
      this.catalog.CatalogName = obj.CatalogName
      this.catalog.Catalog1Id = obj.Catalog1Id || 'ROOT'
    }
  }
}

</script>
