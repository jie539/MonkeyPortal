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
	  console.log(msg);
	},
	sendMessage(state, { action, receiverUid, senderUid }) {
	  if (state.ws) {
		state.ws.send(JSON.stringify({ action, receiverUid, senderUid }));
	  } else {
		console.error('WebSocket connection is not initialized.');
	  }
	},
	SEND_SOCKET_MESSAGE(state, msg) {
		// #ifdef APP-PLUS
		uni.sendSocketMessage({
		      data: msg
		}).success;	
		// #endif
		
		// #ifdef H5
		if(state.ws){
			state.ws.send(msg)
		}
		// #endif
	}
  },
  actions: {
    initWebSocket({ commit },senderUid) {
      // 初始化 WebSocket 连接
	  //const websocketUrl = `ws://localhost:8085/chat/${senderUid}`;
	  const websocketUrl = `ws://appbackend.monkeytree.com.hk:8089/chat/${senderUid}`;
	  
	  // #ifdef H5
	  const ws = new WebSocket(websocketUrl);
	  ws.onopen = function (event) {
	    console.log('WebSocket 连接已打开 ');
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
	    console.error('WebSocket  连接发生错误:', error);
	  };
	  // 将 WebSocket 对象保存到 Vuex 中
	  commit('SET_WS', ws);
	  // #endif

	  // #ifdef APP-PLUS
	  const ws = uni.connectSocket({
		  url: websocketUrl,
		  complete: ()=> {}
	  });
	  uni.onSocketOpen(function (res) {
	    console.log('WebSocket连接已打开！');
	  });
	  uni.onSocketMessage((res)=>{
		  console.log('收到消息:');
		  commit('someMutation', res.data);
	  })
	  uni.onSocketError(function (res) {
	    console.log('WebSocket连接打开失败，请检查！');
	  });
	  uni.onSocketClose(function (res) {
	    console.log('WebSocket 已关闭!');
	  });
	  commit('SET_WS', ws);	  
	  // #endif
    },
	sendSocketMessage({commit},msg){
		commit('SEND_SOCKET_MESSAGE', msg);	
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