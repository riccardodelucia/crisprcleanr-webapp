export const namespaced = true;
export const state = {
  notifications: [],
};

let nextId = 1;

const errorNotificationsTimeout = 5;

export const mutations = {
  PUSH(state, notification) {
    state.notifications.push({ ...notification, storeItemId: nextId++ });
  },
  DELETE(state, notificationToRemove) {
    state.notifications = state.notifications.filter(
      (notification) =>
        notification.storeItemId !== notificationToRemove.storeItemId
    );
  },
};

export const getters = {
  getLastNotification: (state) => {
    return state.notifications[state.notifications.length - 1];
  },
};

export const actions = {
  add({ commit, getters }, notification) {
    commit("PUSH", notification);
    const notificationWithID = getters.getLastNotification;
    notificationWithID?.timeout &&
      setTimeout(() => {
        commit("DELETE", notificationWithID);
      }, notificationWithID.timeout);
  },
  remove({ commit }, notificationToRemove) {
    commit("DELETE", notificationToRemove);
  },
  sendErrorNotification: (
    { dispatch },
    {
      title = "Something went wrong... 💥",
      message = "Unknown error",
      timeout = errorNotificationsTimeout,
    }
  ) => {
    const notification = {
      type: "error",
      title,
      message,
      timeout: timeout * 1000,
    };
    dispatch("add", notification);
  },
  sendSuccessNotification: (
    { dispatch },
    { title = "Success!", message = "Successful request", timeout = 0 }
  ) => {
    const notification = {
      type: "success",
      title,
      message,
      timeout: timeout * 1000,
    };
    dispatch("add", notification);
  },
};
