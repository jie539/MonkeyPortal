const websocket = {
  state: {
    ws: null,
	msg: null
  },
  mutations: {
    SET_WS(state, ws) {
      state.ws = ws;
    },
	someMutation(state,msg){
	  state.msg = msg;
	},
	sendMessage(state, { action, receiverUid, senderUid }) {
		console.log(state.ws.readyState );
	  if (state.ws) {
		state.ws.send(JSON.stringify({ action, receiverUid, senderUid }));
	  } else {
		console.error('WebSocket connection is not initialized.');
	  }
	}
  },
  actions: {
    initWebSocket({ commit },senderUid) {
      // 初始化 WebSocket 连接
      //const ws = new WebSocket(`ws://localhost:8085/chat/${senderUid}`);
	  const ws = new WebSocket(`ws://appbackend.monkeytree.com.hk:8089/chat/${senderUid}`);
		//const ws = new WebSocket('wss://appbackend.monkeytree.com.hk/chat');
      ws.onopen = function (event) {
        console.log('WebSocket 连接已打开');
      };
      ws.onmessage = function (event) {
        console.log('收到消息:');
        // 处理接收到的消息，可以根据需要进行操作
        commit('someMutation', event.data);
      };
      ws.onclose = function (event) {
        console.log('WebSocket 连接已关闭', event);
      };
      ws.onerror = function (error) {
        console.error('WebSocket 连接发生错误:', error);
      };
      // 将 WebSocket 对象保存到 Vuex 中
      commit('SET_WS', ws);
    },
	//进入接收者聊天界面
	joinChat({ commit },{receiverUid,senderUid}){
		commit('sendMessage', { action: 'joinChat', receiverUid, senderUid });
	},
	//退出接收者聊天界面
	exitChat({ commit },{receiverUid,senderUid}){
		commit('sendMessage', { action: 'exitChat', receiverUid, senderUid });
	}
  },
};

export default websocket