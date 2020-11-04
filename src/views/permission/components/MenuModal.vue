<template>
  <el-dialog
    :title="type"
    :visible.sync="dialogVisible"
    width="50%"
  >
    <el-form ref="ruleForm" :model="menu" :rules="rules" label-width="120px">
      <el-form-item label="菜单名称" prop="name">
        <el-input v-model="menu.name" :disabled="disable" />
      </el-form-item>
      <el-form-item label="父级菜单名称" prop="parent">
        <TreeSelect
          :props="props"
          :options="parentOpt"
          :value="menu.parent"
          :clearable="isClearable"
          :accordion="isAccordion"
          style="width: 100%;"
          @getValue="getValue($event)"
        />
      </el-form-item>
      <el-form-item label="路径" prop="path">
        <el-input v-model="menu.path" />
      </el-form-item>
      <el-form-item label="组件名" prop="component">
        <el-input v-model="menu.component" />
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="menu.meta.title" />
      </el-form-item>
      <el-form-item label="图标" prop="icon">
        <el-input v-model="menu.meta.icon" />
      </el-form-item>
      <el-form-item label="不缓存" prop="noCatch">
        <el-select v-model="menu.meta.noCatch" style="width: 100%;">
          <el-option label="不缓存" :value="true" />
          <el-option label="缓存" :value="false" />
        </el-select>
      </el-form-item>
      <el-form-item label="默认路径" prop="redirect">
        <el-input v-model="menu.redirect" />
      </el-form-item>
      <el-form-item label="导航栏隐藏" prop="hidden">
        <el-select v-model="menu.hidden" style="width: 100%;">
          <el-option label="隐藏" :value="true" />
          <el-option label="显示" :value="false" />
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getRoutes } from '@/api/permission/authority'
import TreeSelect from '@/components/TreeSelect'
export default {
  components: { TreeSelect },
  data() {
    return {
      dialogVisible: false,
      type: '',
      parentOpt: [{ name: 'Root' }],
      props: {
        value: 'name',
        label: 'name',
        children: 'children'
        // disabled:true
      },
      isClearable: true, // 可清空（可选）
      isAccordion: true, // 可收起（可选）
      menu: {
        name: '',
        parent: '',
        path: '',
        component: '',
        meta: {
          icon: '',
          title: '',
          noCatch: ''
        },
        redirect: '',
        hidden: ''
      },
      rules: {
        parent: [{ required: true, message: '请输入父级菜单名称', trigger: 'blur' }],
        path: [{ required: true, message: '请输入路径', trigger: 'blur' }],
        component: [{ required: true, message: '请输入组件名称', trigger: 'blur' }]
      }
    }
  },
  computed: {
    disable() {
      return this.type === '编辑'
    }
  },
  created() {
    getRoutes().then(res => {
      this.parentOpt = this.parentOpt.concat(res.data)
    })
  },
  methods: {
    getValue(value) {
      this.menu.parent = value
    },
    add() {
      this.type = '新增'
      this.dialogVisible = true
      this.menu.parent = 'Root'
      this.menu.name = ''
      this.menu.path = ''
      this.menu.component = ''
      this.menu.meta.icon = ''
      this.menu.meta.title = ''
      this.menu.meta.noCatch = true
      this.menu.redirect = ''
      this.menu.hidden = false
    },
    edit(row, parent) {
      this.type = '编辑'
      this.dialogVisible = true
      this.menu.parent = parent || 'Root'
      this.menu.name = row.name || ''
      this.menu.path = row.path || ''
      this.menu.component = row.component || ''
      this.menu.meta.icon = row.meta.icon || ''
      this.menu.meta.title = row.meta.title || ''
      this.menu.meta.noCatch = row.meta.noCatch || true
      this.menu.redirect = row.redirect || ''
      this.menu.hidden = row.hidden || false
    }
  }
}

</script>
