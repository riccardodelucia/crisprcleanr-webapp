export const namespaced = true;
export const state = {
  uploads: [
    /*  { jobId: "1234abcd", file: {}, startByte: 0 },
    { jobId: "1234abcde", file: {}, startByte: 0 }, */
  ],
};

let nextId = 1;

export const mutations = {
  PUSH(state, file) {
    state.uploads.push({ ...file, storeItemId: nextId++ });
  },
  DELETE(state, uploadToRemove) {
    state.uploads = state.uploads.filter(
      (upload) => upload.storeItemId !== uploadToRemove.storeItemId
    );
  },
};

export const getters = {};

export const actions = {
  add({ commit }, file) {
    commit("PUSH", file);
  },
  remove({ commit }, upload) {
    commit("DELETE", upload);
  },
};
