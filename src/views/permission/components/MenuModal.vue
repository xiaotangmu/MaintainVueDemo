<template>
  <el-dialog
    :title="type"
    :visible.sync="dialogVisible"
    width="50%"
  >
    <el-form ref="ruleForm" :model="menu" :rules="rules" label-width="120px">
      <el-form-item label="菜单名称" prop="name">
        <el-input v-model="menu.name" :disabled="!permission.includes('menu:edit:name,component,path,pid,isLeaf')" />
      </el-form-item>
      <el-form-item label="父级菜单名称" prop="pid">
        <TreeSelect
          :disabled="!permission.includes('menu:edit:name,component,path,pid,isLeaf')"
          :props="props"
          :options="options"
          :value="menu.pid"
          :clearable="isClearable"
          :accordion="isAccordion"
          :choose-leaf="chooseLeaf"
          :filter-arr="filterArr"
          :filter-key="{ key: 'leaf', value: 1 }"
          style="width: 100%;"
          @getValue="getValue"
        />
      </el-form-item>
      <el-form-item label="路径" prop="path">
        <el-input v-model="menu.path" :disabled="!permission.includes('menu:edit:name,component,path,pid,isLeaf')" @change="validatePath" />
      </el-form-item>
      <el-form-item label="标题" prop="meta.title">
        <el-input v-model="menu.meta.title" clearable />
      </el-form-item>
      <el-form-item label="类型" prop="leaf">
        <el-select v-model="menu.leaf" :disabled="!permission.includes('menu:edit:name,component,path,pid,isLeaf')">
          <el-option label="菜单" :value="1" />
          <el-option label="目录" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="组件名" prop="component">
        <el-select v-model="menu.component" :disabled="!permission.includes('menu:edit:name,component,path,pid,isLeaf')" filterable clearable placeholder="请选择">
          <el-option
            v-for="item in cpnOptions"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="图标" prop="icon">
        <el-select v-model="menu.meta.icon" filterable clearable placeholder="请选择">
          <el-option
            v-for="item in elementIcons"
            :key="item"
            :label="item"
            :value="item"
          >
            <svg-icon :icon-class="item" />
            {{ item }}
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="不缓存" prop="noCatch">
        <el-select v-model="menu.meta.noCatch">
          <el-option label="不缓存(默认)" :value="1" />
          <el-option label="缓存" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="重定向" prop="redirect">
        <el-input v-model="menu.redirect" />
      </el-form-item>
      <el-form-item label="导航栏隐藏" prop="hidden">
        <el-select v-model="menu.hidden">
          <el-option label="隐藏" :value="1" />
          <el-option label="显示(默认)" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number v-model="menu.sort" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { deepClone } from '@/utils'
import { addMenu, updMenu } from '@/api/permission/menu'
import { cpnArr } from '@/config/components'
import TreeSelect from '@/components/TreeSelect'
import { iconArr } from '@/icons'
export default {
  components: { TreeSelect },
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      elementIcons: iconArr,
      cpnOptions: Object.assign([], cpnArr),
      pid: '',
      dialogVisible: false,
      type: '',
      parentOpt: [{ id: '0', name: 'Root', level: -1, leaf: 0 }],
      props: {
        value: 'id',
        label: 'name',
        children: 'children'
        // disabled:true
      },
      isClearable: true, // 可清空（可选）
      isAccordion: true, // 可收起（可选）
      chooseLeaf: false, // 只选叶子结点(可选)
      menu: {
        id: '',
        name: '',
        sort: 0,
        pid: '0',
        path: '',
        leaf: 1,
        component: '',
        level: 0,
        meta: {
          icon: '',
          title: '',
          noCatch: ''
        },
        redirect: '',
        hidden: '',
        children: [],
        permissionList: []
      },
      rules: {
        name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
        pid: [{ required: true, message: '请选择父级菜单', trigger: 'blur' }],
        leaf: [{ required: true, message: '请选择类型', trigger: 'blur' }],
        path: [{ required: true, message: '请输入路径', trigger: 'blur' }],
        'meta.title': [{ required: true, message: '请输入菜单标题', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters(['permission']),
    disable() {
      return this.type === '编辑'
    },
    options() {
      return this.parentOpt.concat(this.data)
    },
    changeParent() {
      return this.pid !== this.menu.pid
    },
    filterArr() {
      const arr = [this.menu.id]
      if (this.menu.children) {
        return arr.concat(this.getIdArr(this.menu.children))
      }
      return arr
    }
  },
  watch: {
    'menu.leaf'(val) {
      if (val === 0 && this.menu.permissionList.length > 0) {
        this.menu.leaf = 1
        this.$message({ message: '该菜单有绑定权限， 不能变更为目录', type: 'warning' })
      } else if (val === 1 && this.menu.children.length > 0) {
        this.menu.leaf = 0
        this.$message({ message: '存在子级，不能变更为菜单', type: 'warning' })
      }
    },
    'menu.pid'(val) {
      if (val !== '0') {
        if (this.menu.path.charAt(0) === '/') {
          this.menu.path = this.menu.path.replace(/^\/+/, '')
        }
      }
    }
  },
  methods: {
    getIdArr(arr) {
      let target = []
      arr.forEach(i => {
        target.push(i.id)
        if (i.children) {
          const temp = this.getIdArr(i.children)
          if (temp.length > 0) {
            target = [...target, temp]
          }
        }
      })
      return target
    },
    validatePath(val) {
      if (val && val.charAt(0) === '/') {
        this.menu.path = this.menu.path.replace(/^\/+/, '/')
      }
    },
    getValue(value, data) {
      this.menu.pid = value
      this.menu.level = data.level + 1
    },
    add() {
      this.type = '新增'
      this.dialogVisible = true
      this.menu.pid = '0'
      this.menu.id = ''
      this.menu.name = ''
      this.menu.leaf = 1
      this.menu.sort = 0
      this.menu.path = ''
      this.menu.component = ''
      this.menu.meta.icon = ''
      this.menu.meta.title = ''
      this.menu.meta.noCatch = 1
      this.menu.redirect = ''
      this.menu.hidden = 0
      this.menu.children = []
      this.menu.permissionList = []
      this.menu.level = 0
    },
    edit(row, pid) {
      this.type = '编辑'
      row = JSON.parse(JSON.stringify(row))
      this.dialogVisible = true
      this.pid = this.menu.pid = pid || '0'
      this.menu.id = row.id || ''
      this.menu.name = row.name || ''
      this.menu.sort = row.sort || 0
      this.menu.leaf = row.leaf
      this.menu.path = row.path || ''
      this.menu.component = row.component || ''
      this.menu.meta.icon = row.meta.icon || ''
      this.menu.meta.title = row.meta.title || ''
      this.menu.meta.noCatch = row.meta.noCatch
      this.menu.redirect = row.redirect || ''
      this.menu.hidden = row.hidden
      this.menu.children = row.children || []
      this.menu.permissionList = row.permissionList || []
      this.menu.level = row.level || 0
    },
    submit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.type === '编辑') {
            this.updMenu(this.menu)
          } else {
            this.addMenu(this.menu)
          }
        }
      })
    },
    async addMenu(row) {
      const { data } = await addMenu({
        'Path': row.path,
        'Component': row.component,
        'Redirect': row.redirect,
        'Hidden': row.hidden,
        'Title': row.meta.title,
        'Icon': row.meta.icon,
        'ParentId': row.pid,
        'Level': row.level,
        'Leaf': row.leaf,
        'NoCache': row.meta.noCatch,
        'Remark1': '',
        'Remark2': '',
        'SortNum': row.sort,
        'Code': row.name
      })
      const obj = deepClone(row)
      this.dialogVisible = false
      obj.id = data
      this.$emit('handleAdd', 'id', row.pid, obj)
    },
    async updMenu(row) {
      await updMenu({
        'Id': row.id,
        'Path': row.path,
        'Component': row.component,
        'Redirect': row.redirect,
        'Hidden': row.hidden,
        'Title': row.meta.title,
        'Leaf': row.leaf,
        'Icon': row.meta.icon,
        'ParentId': row.pid,
        'Level': row.level,
        'NoCache': row.meta.noCatch,
        'Remark1': '',
        'Remark2': '',
        'SortNum': row.sort,
        'Code': row.name
      })
      this.dialogVisible = false
      const obj = deepClone(row)
      this.$emit('handleUpd', 'id', row.id, obj, this.changeParent)
    }
  }
}

</script>
