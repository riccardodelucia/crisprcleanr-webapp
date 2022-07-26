export const namespaced = true;
export const state = {
  notifications: [
    /*  {
      type: "success",
      title: "Test",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer pulvinar euismod nibh quis ornare. Quisque mattis sit amet risus eget vehicula. Sed tempus orci odio, nec pharetra turpis tincidunt iaculis. Cras sit amet turpis leo. Aliquam sed tortor vel neque aliquam vestibulum et eu turpis. Vivamus gravida eu tellus at eleifend. Duis hendrerit, nisl eget iaculis ultricies, ipsum leo viverra sem, sit amet elementum elit justo sit amet sem. Vestibulum fringilla elit vel pulvinar gravida. Vivamus sollicitudin lectus id mauris vulputate aliquet vel at velit. Donec id nunc accumsan, efficitur sem at, eleifend quam. Sed vestibulum dignissim ornare. Fusce cursus dui leo, rhoncus commodo augue egestas sit amet. Aliquam imperdiet vel erat sed laoreet. Phasellus at pulvinar massa, placerat accumsan enim. Morbi vitae facilisis massa. Curabitur volutpat nisl sit amet dignissim tristique. Etiam ac urna tincidunt, viverra sapien non, condimentum orci. Nunc a dui eu diam suscipit facilisis id sed lorem. Morbi id mauris non neque dignissim placerat. Donec aliquet nisi enim, eget efficitur ipsum feugiat in. Donec mauris urna, elementum in ligula quis, sodales maximus felis. Donec facilisis eros sit amet ornare semper. Praesent consectetur, tortor nec maximus lobortis, eros nunc consectetur justo, vel consequat dolor lacus id lorem. Nunc luctus varius fringilla. Nunc mollis imperdiet leo sed luctus. Pellentesque venenatis mauris nec libero pellentesque iaculis. Sed ac facilisis nisi, ac eleifend sem. Proin maximus volutpat erat, accumsan condimentum dolor facilisis sit amet. Suspendisse et eros nec nibh malesuada tempor. Fusce venenatis lorem sapien, vel lacinia nisi ultrices efficitur. Mauris dolor neque, aliquet sit amet justo ut, gravida varius lectus. Aliquam diam eros, porttitor in molestie sed, sollicitudin at massa. Phasellus sit amet sapien hendrerit urna elementum facilisis a at turpis. Cras tempus mi ut diam tincidunt, eget iaculis diam iaculis. Praesent rhoncus sem eros, nec ultricies sapien congue eget. Mauris quis leo et tellus venenatis dapibus quis quis nunc. Donec ornare nisi id vehicula fringilla. In eget felis convallis, placerat eros sodales, rutrum diam. Aliquam in tincidunt massa. Maecenas ac est ac ante ornare ullamcorper. Aliquam erat volutpat. Donec sed velit elit. Cras ac pellentesque enim. Sed vestibulum, dui vitae accumsan posuere, tortor ante tempus felis, ac ullamcorper risus mi sed enim. Donec luctus enim quis felis pulvinar laoreet. Quisque aliquet eros vel nisl tempor, ac ullamcorper dolor imperdiet. Suspendisse rhoncus quam ex, scelerisque rhoncus mauris mattis vel. Maecenas pretium est et suscipit euismod. Proin luctus congue lorem sed tempus. Aliquam dictum, tortor scelerisque porta gravida, erat dolor fringilla arcu, quis euismod ex enim a nulla. Aliquam pellentesque ligula et enim consequat auctor. Ut id urna nisl. Cras et ante id tortor egestas aliquet. Pellentesque nisi ligula, facilisis et dui a, cursus cursus nunc.",
      timeout: 0,
    }, */
  ],
};

let nextId = 1;

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
      }, 5000);
  },
  remove({ commit }, notificationToRemove) {
    commit("DELETE", notificationToRemove);
  },
  sendNotification: (
    { dispatch },
    { type = "success", title = "", message = "", timeout = 0 }
  ) => {
    const notification = { type, title, message, timeout: timeout * 1000 };
    dispatch("add", notification);
  },
};
