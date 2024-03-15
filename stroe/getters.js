// getters.js
const getters = {
	studentId: state => state.user.studentId,
	studentName: state => state.user.studentName,
	studentInfo: state => state.user.studentInfo,
	lang: state => state.lang.type,
	local: state => state.lang.local,
	guardianId :status => status.user.guardianId,
	guardianName :status => status.user.guardianName,
	msg :status =>status.websocket.msg,
};

export default getters;
