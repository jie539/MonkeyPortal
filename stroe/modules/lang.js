const lang ={
	state:{
		type:['en','zh_cn','zh_hk'],//英文，简中，繁中
		local:''
	},
	mutations:{
		SET_LOCAL(state, { local }) {
		      state.local = local;
		      uni.setStorageSync('lang', local);
		},
	},
	actions:{
		setLang({ commit }, local) {
		      commit('SET_LOCAL', { local: local || uni.getStorageSync('lang') });
		},
	}
}
export default lang