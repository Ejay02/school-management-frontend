import socket from "./socket";

export default {
  install(app) {
    // Make the socket instance available in all components via this.$socket
    app.config.globalProperties.$socket = socket;
  },
};
