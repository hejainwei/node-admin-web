import {constantRouterMap} from '@/router'
import Fetch from '@/utils/fetch'

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    fetch:new Fetch(),
    allRoles: [],
    allFunctions: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    },
    INIT_ROUTERS : (state) => {
      state.addRouters = []
    },
    SET_ALLROLES : (state, allRoles) => {
      state.allRoles = allRoles
    },
    SET_ALLFUNCTIONS :  (state, allFunctions) => {
      state.allFunctions = allFunctions
    }
  },
  actions: {
    GenerateRoutes({ commit,state }, accessedRouters) {
      return new Promise(resolve => {
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    },
    InitAddRouters({ commit }) {
      commit('INIT_ROUTERS')
    },
    GetAllRole({ commit,state }) {
      return state.fetch.post({
        "url":"role/getAllRoles",
        "data":{}
      }).then((response)=>{
        if(response.status==1){
          commit('SET_ALLROLES',response.data.allRoles)
        }
        return response
      })
    },
  }
}

export default permission
