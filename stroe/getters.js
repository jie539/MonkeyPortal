// getters.js
const getters = {
	studentId: state => state.user.studentId,
	studentName: state => state.user.studentName,
	studentInfo: state => state.user.studentInfo,
	lang: state => state.lang.type,
	guardianId :status => status.user.guardianId,
	guardianName :status => status.user.guardianName,
	msg :status =>status.websocket.msg,
};

export default getters;
