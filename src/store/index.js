import { createStore } from 'vuex';
import * as user from '@/store/modules/user.js';
import * as notification from '@/store/modules/notification.js';
import * as uploads from '@/store/modules/uploads.js';
import * as progressBar from '@/store/modules/progressBar.js';

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    notification,
    user,
    uploads,
    progressBar,
  },
});
