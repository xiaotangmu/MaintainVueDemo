<template>
  <div>
    <el-submenu v-if="item.children.length>0" :index="item.id">
      <template slot="title"><svg-icon v-if="item.meta.icon" :icon-class="item.meta.icon" />{{ item.meta.title }}</template>
      <template v-for="i in item.children">
        <submenu :key="i.id" :item="i" @select="select" />
      </template>
    </el-submenu>
    <el-menu-item v-else :index="item.id" @click="select(item)">{{ item.meta.title }}</el-menu-item>
  </div>
</template>
<script>
export default {
  name: 'Submenu',
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    select(row) {
      this.$emit('select', row)
    }
  }
}
</script>
