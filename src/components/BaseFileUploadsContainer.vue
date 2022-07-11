<template>
  <div v-if="uploads.length > 0" class="uploads card">
    <h3 class="u-margin-bottom-small">Uploading Files</h3>
    <div class="uploads__controllers-container">
      <FileUploadController v-for="upload in uploads" :key="upload.storeItemId" :upload="upload">
      </FileUploadController>
    </div>

  </div>
</template>

<script>
import FileUploadController from "@/components/ccr/FileUploadController"
import { mapState } from "vuex";
export default {
  name: "BaseFileUploadsContainer",
  components: { FileUploadController },
  computed: {
    ...mapState("uploads", ["uploads"]),
  },
};
</script>

<style lang="scss">
.uploads__controllers-container {

  display: flex;
  flex-direction: column;
}
</style>
