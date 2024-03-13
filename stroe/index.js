import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user.js'
import lang from './modules/lang.js'
import websocket from './modules/websocket.js'
import getters from './getters.js'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
	lang,
	websocket
  },
  getters
})

export default store