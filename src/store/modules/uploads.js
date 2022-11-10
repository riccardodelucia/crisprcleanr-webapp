export const namespaced = true;
export const state = {
  uploads: [],
};

let nextId = 1;

export const mutations = {
  PUSH(state, upload) {
    state.uploads.push({ ...upload, storeItemId: nextId++ });
  },
  DELETE(state, uploadToRemove) {
    state.uploads = state.uploads.filter(
      (upload) => upload.storeItemId !== uploadToRemove.storeItemId
    );
  },
};

export const getters = {};

export const actions = {
  add({ commit }, upload) {
    commit('PUSH', upload);
  },
  remove({ commit }, upload) {
    commit('DELETE', upload);
  },
};
