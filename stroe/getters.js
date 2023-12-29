// getters.js
const getters = {
	studentId: state => state.user.studentId,
	studentName: state => state.user.studentName,
	studentInfo: state => state.user.studentInfo,
	lang: state => state.lang.type
};

export default getters;
