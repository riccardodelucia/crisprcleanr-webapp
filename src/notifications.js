import { ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';

function timedOutNotificationDelete(notification, timeout) {
  setTimeout(() => {
    removeNotification(notification);
  }, timeout);
}

function sendNotification(notification, timeout) {
  const notificationAndId = { ...notification, id: uuidv4() };
  notifications.value.push(notificationAndId);
  timeout && timedOutNotificationDelete(notificationAndId, timeout * 1000);
}

export function sendSuccessNotification({
  title = 'Success!',
  message = 'Successful request',
  timeout = notificationsTimeout,
}) {
  sendNotification(
    {
      type: 'success',
      title,
      message,
    },
    timeout
  );
}

export function sendErrorNotification({
  title = 'Something went wrong... 💥',
  message = 'Unknown error',
  timeout = notificationsTimeout,
}) {
  sendNotification(
    {
      type: 'error',
      title,
      message,
    },
    timeout
  );
}

export function removeNotification({ id }) {
  notifications.value = notifications.value.filter(
    (notification) => notification.id !== id
  );
}

const notificationsTimeout = 5;
export const notifications = ref([]);
