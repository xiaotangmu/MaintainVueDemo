<template>
  <el-drawer
    :visible.sync="drawer"
    :with-header="false"
  >
    <div style="padding: 0 20px;">
      <h4>消息</h4>
      <el-tag type="info" style="cursor: pointer;" @click="type = 'all'">全部</el-tag>
      <el-tag type="success" style="cursor: pointer;" @click="type=0">未读</el-tag>
      <el-tag type="primary" style="cursor: pointer;" @click="type=1">已读</el-tag>
      <el-link icon="el-icon-edit" style="margin-left: 10px; font-size: 12px;" @click="allRead">全部标记已读</el-link>
      <el-link icon="el-icon-delete" style="margin-left: 10px; font-size: 12px;" @click="delAllRead">删除全部已读</el-link>
      <el-collapse accordion>
        <div v-for="o in data" :key="o.id" @click="read(o.id, o.userId, o.type)">
          <el-collapse-item>
            <template slot="title">
              <div style="position: relative; width: 100%;">
                <el-checkbox @change="checkItem(val, o)" />
                {{ o.title }}<i class="header-icon el-icon-info" /><span v-if="o.type === 0" style="margin-left: 7px;font-size: 12px; color: #67C23A; transform: scale(0.1);">未读</span>
                <span style="float: right; margin-right: 7px;"><el-link type="danger" icon="el-icon-delete" @click="delRead(o.id, o.userId)" /></span>
              </div>
            </template>
            <p style="margin: 0;">库存名:{{ o.content.SkuName }}</p>
            <p style="margin: 0;">品牌:{{ o.content.Brand }}</p>
            <p style="margin: 0;">价格:{{ o.content.Price | toMoney }}</p>
            <p style="margin: 0;">数量:{{ o.content.TotalCount + "(" + o.content.Unit + ")" }}</p>
            <p style="margin: 0;">警报值:{{ o.content.Alarm }}</p>
            <p style="margin: 0;">类型:{{ o.content.Tool === 0 ? "配件" : "工具" }}</p>
            <p style="margin: 0;">描述:{{ o.content.Description }}</p>
            <div style="margin: 0;">属性:
              <el-tag v-for="i in o.content.AttrList" :key="i.Id">
                {{ i.AttrName }}
                {{ i.Value }}
              </el-tag>
            </div>
            <div style="margin: 0;">
              位置:
              <div v-for="item in o.content.addressList" :key="item.Id">
                {{ '房间'+item.Room+ '  货架'+ item.Self + '(' + (item.Status===0?'新':'旧') + ')' }}
              </div>
            </div>
          </el-collapse-item>
        </div>
      </el-collapse>
    </div>
  </el-drawer>
</template>
<script>
import { mapGetters } from 'vuex'
import { markRead, markReadAll, delReadAll, delRead } from '@/api/message'
export default {
  data() {
    return {
      data: [],
      drawer: false,
      type: 'all',
      checkedList: []
    }
  },
  computed: {
    ...mapGetters([
      'ws_msg'
    ])
  },
  watch: {
    type(val) {
      this.getData(val)
    }
  },
  mounted() {
    this.data = this.ws_msg.user.warning
  },
  methods: {
    visit() {
      this.drawer = true
    },
    read(id, user, type) {
      if (type === 1) return
      markRead({
        'NotificationId': id,
        'UserId': user
      })
      this.$store.commit('websocket/READ_USER_WARNING', id)
    },
    allRead() {
      markReadAll()
      this.$store.commit('websocket/ALL_READ_USER_WARNING')
    },
    getData(n) {
      if (n === 'all') {
        this.data = this.ws_msg.user.warning
        return
      }
      this.data = this.ws_msg.user.warning.filter(i => n === i.type)
    },
    delAllRead() {
      if (this.ws_msg.user.warning.length < 1) return
      delReadAll({ UserId: this.ws_msg.user.warning[0].userId })
      this.$store.commit('websocket/DEL_WARNING_READ')
    },
    delRead(id, user) {
      delRead({
        'NotificationId': id,
        'UserId': user
      })
      this.$store.commit('websocket/DEL_WARNING', id)
    },
    checkItem(i, a) {
      console.log(i, a)
    }
  }
}
</script>

<style lang="scss">
:focus {
  outline: 0 !important;
}
</style>
