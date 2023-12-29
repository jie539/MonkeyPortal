const user ={
	state:{
		studentId:'',
		studentName:'',
		studentInfo:[]
	},
	mutations:{
		SET_STUDENT_INFO(state, { id, name }) {
		    state.studentId = id;
		    state.studentName = name;
		  },
	},
	actions:{
		setStudentInfo({ commit, state }, index) {
		    const student = state.studentInfo[index];
		    if (student) {
		      // 调用 SET_STUDENT_INFO mutation，将学生信息设置到 state 中
		      commit('SET_STUDENT_INFO', { id: student.student_id, name: student.student_name });
		    }
		}	
	}
}
export default user