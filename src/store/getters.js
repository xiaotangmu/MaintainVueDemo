const getters = {
  // app
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,

  // tagsView
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,

  // uesr
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  username: state => state.user.username,
  introduction: state => state.user.introduction,
  routes: state => state.user.routes,
  role: state => state.user.role,

  // permission
  permission_routes: state => state.permission.routes,
  permission: state => state.permission.permission,

  // errorLog
  errorLogs: state => state.errorLog.logs,

  // ws
  ws: state => state.websocket.ws,
  ws_msg: state => state.websocket.msg,
  ws_badge: state => state.websocket.badge
}
export default getters
