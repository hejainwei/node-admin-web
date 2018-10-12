<template>
  <div style="margin-top:30px; margin-left:30px;">
    <label>角色:&nbsp;</label><el-select v-model="selectRoleId" placeholder="请选择" @change="getRoleFunctions()">
      <el-option
        v-for="item in allRoles"
        :key="item.role_id"
        :label="item.role_name"
        :value="item.role_id"/>
    </el-select>
    <el-button @click="saveRight()">保存</el-button>
    <el-tree
      ref="tree"
      :data="allFunctions"
      :default-expanded-keys="mainMenu"
      :default-checked-keys="roleFunctions"
      show-checkbox
      node-key="id"/>
  </div>
</template>

<script>
import Fetch from '@/utils/fetch'
import { Message } from 'element-ui'
export default {
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      mainMenu: [0],
      allFunctions: [{ id: 0, label: '菜单导航', children: [] }],
      selectRoleId: '',
      allRoles: [],
      roleFunctions: [],
      fetch: new Fetch(),
      menuTree: {}
    }
  },
  computed: {
  },
  mounted() {
    this.getFunction()
    this.getRoleFunctions()
    this.getAllRole()
  },
  methods: {
    getFunction() {
      var self = this
      this.fetch.post({
        'url': 'function/getAllFunctions',
        'data': {}
      }).then(response => {
        if (response.status === 1) {
          self.menuTree = response.data.menuTree
          self.handleMenu(self.menuTree[0], self.allFunctions[0].children)
        }
      })
    },
    getAllRole() {
      this.fetch.post({
        'url': 'role/getAllRoles',
        'data': {}
      }).then(response => {
        if (response.status === 1) {
          this.allRoles = response.data.allRoles
        }
      })
    },
    handleMenu(menuList, parent) {
      if (!menuList) return
      let menu = {}
      let router = {}
      let _id
      let router_temp = {}
      for (const index in menuList) {
        menu = menuList[index]
        _id = menu.function_id || menu.menu_id
        router = {
          id: _id,
          label: menu.function_name || menu.menu_name
        }
        router_temp = this.menuTree[_id]
        if (router_temp) {
          router.children = []
          parent.push(router)
          this.handleMenu(router_temp, router.children)
        } else {
          parent.push(router)
        }
      }
    },
    getRoleFunctions() {
      this.roleFunctions = []
      this.fetch.post({
        'url': 'function/getRoleFunctions',
        'data': {
          'roleId': this.selectRoleId
        }
      }).then(response => {
        if (response.status === 1) {
          this.roleFunctions = response.data.roleFunctions
          this.$refs.tree.setCheckedKeys(this.roleFunctions)
        }
      })
    },
    saveRight() {
      if (!this.selectRoleId) {
        Message({
          message: '请选择角色',
          type: 'error',
          duration: 2 * 1000
        })
        return false
      }
      const selectKeys = this.$refs.tree.getCheckedKeys()
      const functionList = selectKeys.length > 0 ? selectKeys.join(',') : ''
      this.fetch.post({
        'url': 'function/saveRoleFunction',
        'data': {
          'roleId': this.selectRoleId,
          'functionList': functionList
        }
      }).then(response => {
        if (response.status === 1) {
          Message({
            message: response.msg,
            type: 'success',
            duration: 2 * 1000
          })
        }
      })

      console.log()
    }
  }
}
</script>
<style lang="scss" scoped>
.el-tree{
  margin-top: 30px;
}
</style>
