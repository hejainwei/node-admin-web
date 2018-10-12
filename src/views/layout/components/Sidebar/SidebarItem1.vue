<template>
  <div v-if="!item.hidden" class="menu-wrapper">

    <template v-if="item.children && hasShowingChild(item.children)">
      <el-submenu :index="item.name||item.path">
        <template slot="title">
          <item v-if="item.meta" :icon="item.meta.icon" :title="generateTitle(item.meta.title)" />
        </template>
        <template v-for="child in item.children" v-if="!child.hidden">
          <sidebar-item :is-nest="true" :item="child" :key="child.path" :base-path="resolvePath(child.path)" class="nest-menu"/>
        </template>
      </el-submenu>
    </template>
    <a v-else :href="item.path" :key="item.name" target="_blank" @click="clickLink(item.path,$event)">
      <el-menu-item :index="resolvePath(item.path?item.path:'dashboard')">
        <item v-if="item.meta" :icon="item.meta.icon" :title="generateTitle(item.meta.title)" />
      </el-menu-item>
    </a>
  </div>
</template>

<script>
import path from 'path'
import { generateTitle } from '@/utils/i18n'
import { validateURL } from '@/utils/validate'
import Item from './Item'

export default {
  name: 'SidebarItem',
  components: { Item },
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      onlyOneChild: null
    }
  },
  methods: {
    hasShowingChild(children) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          return true
        }
      })
      if (showingChildren.length >= 1) {
        return true
      }
      return false
    },
    resolvePath(routePath) {
      return path.resolve(this.basePath, routePath)
    },
    isExternalLink(routePath) {
      return validateURL(routePath)
    },
    clickLink(routePath, e) {
      if (!this.isExternalLink(routePath)) {
        e.preventDefault()
        const path = this.resolvePath(routePath)
        this.$router.push(path)
      }
    },
    generateTitle
  }
}
</script>
