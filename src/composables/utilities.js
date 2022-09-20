import { onMounted, onUnmounted } from "vue";

export const date = (dateTime) => {
  const date = new Date(Date.parse(dateTime));
  return date.toLocaleString();
};

export const download = function (data, filename) {
  const link = document.createElement("a");

  link.href = window.URL.createObjectURL(data); // data must be instaceof Blob

  link.setAttribute("download", filename);

  document.body.appendChild(link);

  link.click();

  link.remove();
  URL.revokeObjectURL(link.href);
};

export const resizeListener = function (resizeListener) {
  onMounted(() => {
    window.addEventListener("resize", resizeListener);
    window.dispatchEvent(new Event("resize"));
  });
  onUnmounted(() => {
    window.removeEventListener("resize", resizeListener);
  });
};
