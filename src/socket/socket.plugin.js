/*──────────────────────────────────────────────*
 |                                              |
 |    _____  _                                  |
 |   | ____|(_)                                 |
 |   |  _|  | |                                 |
 |   | |___ | |                                 |
 |   |_____|/ |                                 |
 |        |__/                                  |
 |                                              |
 |    🔧 Crafted with 🖤 by Ej                  |
 |    🔗 github.com/Ejay02                      |
 |    🚀 Clean. Scalable. Sharp.                |
 |                                              |
 *──────────────────────────────────────────────*/
import { socket, updateToken } from "./socket";

export default {
  install(app) {
    app.config.globalProperties.$socket = socket;
    app.config.globalProperties.$updateSocketToken = updateToken;
    
    // Connect socket if token exists
    const token = localStorage.getItem('accessToken');
    if (token) {
      socket.connect();
    }
  },
};
