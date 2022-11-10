import nProgress from 'nprogress';

export const namespaced = true;
export const state = {
  requestsCounter: 0,
};

export const mutations = {
  INCREASE(state) {
    state.requestsCounter++;
  },
  DECREASE(state) {
    state.requestsCounter = Math.max(0, state.requestsCounter - 1);
  },
};

export const actions = {
  increase({ commit }) {
    commit('INCREASE');
    if (state.requestsCounter >= 1) nProgress.start();
  },
  decrease({ commit }) {
    commit('DECREASE');
    if (state.requestsCounter === 0) nProgress.done();
  },
};
