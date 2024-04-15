const user ={
	state:{
		studentId:'',
		studentName:'',
		studentInfo:[],
		expireTime:'',
		guardianId:'',
		guardianName:'',
		info:'点击添加地址'
	},
	mutations:{
		SET_STUDENT_INFO(state, { id, name,student }) {
		    state.studentId = id;
		    state.studentName = name;
			state.info = student;
			//uni.setStorageSync('studentId',id);
			//uni.setStorageSync('studentName',name);
			uni.setStorageSync('info',student);
		},
		SET_USER_INFO(state, { userInfo }) {
		    state.studentId = userInfo[0].studentId;
		    state.studentName = userInfo[0].studentName;
			state.studentInfo = userInfo;
			state.info = userInfo[0];
			state.expireTime = new Date().getTime() + 7 * 24 * 60 *10 * 1000;//过期时间30天
			uni.setStorageSync('studentInfo',userInfo);
			uni.setStorageSync('info',userInfo[0]);
			//uni.setStorageSync('studentId',userInfo[0].studentId);
			//uni.setStorageSync('studentName',userInfo[0].studentName);
			uni.setStorageSync('expireTime',state.expireTime);
		},
		SET_GUARDIAN_ID(state, { guardianId }) {
		      state.guardianId = guardianId;
		      uni.setStorageSync('guardianId', guardianId);
		},
		SET_GUARDIAN_NAME(state, { guardianName }) {
		      state.guardianName = guardianName;
		      uni.setStorageSync('guardianName', guardianName);
		},
	},
	actions:{
		setStudentInfo({ commit, state }, index) {
		    const student = state.studentInfo[index];
		    if (student) {
		      commit('SET_STUDENT_INFO', { id: student.studentId, name: student.studentName,student:student });
		    }
		},	
		setUserInfo({ commit,state }, userInfo){
			if(userInfo){
				commit('SET_USER_INFO', { userInfo });
			}
		},
		setGuardianId({ commit }, guardianId) {
		      commit('SET_GUARDIAN_ID', { guardianId: guardianId || uni.getStorageSync('guardianId') });
		},
		setGuardianName({ commit }, guardianName) {
		      commit('SET_GUARDIAN_NAME', { guardianName: guardianName || uni.getStorageSync('guardianName') });
		}
	}
}
export default user