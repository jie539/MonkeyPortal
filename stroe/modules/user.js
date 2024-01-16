const user ={
	state:{
		studentId:'',
		studentName:'',
		studentInfo:[],
		expireTime:''
	},
	mutations:{
		SET_STUDENT_INFO(state, { id, name }) {
		    state.studentId = id;
		    state.studentName = name;
			uni.setStorageSync('studentId',id);
			uni.setStorageSync('studentName',name);
		},
		SET_USER_INFO(state, { userInfo }) {
		    state.studentId = userInfo[0].studentId;
		    state.studentName = userInfo[0].studentName;
			state.studentInfo = userInfo;
			state.expireTime = new Date().getTime() + 30 * 24 * 60 *10 * 1000;//过期时间30天
			uni.setStorageSync('studentInfo',userInfo);
			uni.setStorageSync('studentId',userInfo[0].studentId);
			uni.setStorageSync('studentName',userInfo[0].studentName);
			uni.setStorageSync('expireTime',state.expireTime);
		},
	},
	actions:{
		setStudentInfo({ commit, state }, index) {
		    const student = state.studentInfo[index];
		    if (student) {
		      // 调用 SET_STUDENT_INFO mutation，将学生信息设置到 state 中
		      commit('SET_STUDENT_INFO', { id: student.studentId, name: student.studentName });
		    }
		},	
		setUserInfo({ commit,state }, userInfo){
			if(userInfo){
				commit('SET_USER_INFO', { userInfo });
			}
		}
	}
}
export default user