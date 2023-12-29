import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user.js'
import lang from './modules/lang.js'
import getters from './getters.js'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
	lang
  },
  getters
})

export default store