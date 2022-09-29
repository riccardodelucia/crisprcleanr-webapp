<template>
  <div class="uploads__file upload-controller">
    <div class="upload-controller__file">
      <BaseIcon v-if="state.matches('uploaded')" class="upload-controller__icon upload-controller__icon--uploaded"
        name="check-circle" width="20px" height="20px">
      </BaseIcon>
      <span>{{ filename }}</span>
    </div>
    <span v-if="state.matches('uploading') || state.matches('uploaded')" class="upload-controller__percentage">{{
    state.context.percentage
    }}%</span>
    <BaseIcon v-if="state.matches('uploading')" class="upload-controller__icon upload-controller__icon--delete"
      name="trash-2" width="20px" height="20px" @click="abort">
    </BaseIcon>
    <BaseIcon v-else class="upload-controller__icon upload-controller__icon--remove" name="x-circle" width="20px"
      height="20px" @click="removeUpload">
    </BaseIcon>
    <div class="upload-controller__status">
      <div v-if="state.matches('uploading')" class="upload-controller__progress-bar-container">
        <div class="upload-controller__progress-bar" :style="{ width: state.context.percentage + '%' }"></div>
      </div>
      <div v-else-if="state.matches('uploaded')" class="upload-controller__uploaded-msg-container">
        <span class="upload-controller__status-message">Uploaded. Click &nbsp;</span>
        <BaseIcon name="x-circle" width="10px" height="10px">
        </BaseIcon>
        <span class="upload-controller__status-message"> &nbsp; to close</span>
      </div>
      <span v-else-if="state.matches('aborted')"
        class="upload-controller__status-message">{{state.context.errorMessage}}</span>
    </div>
  </div>
</template>

<script>
import { useMachine } from "@xstate/vue";
import uploadFileMachine from "@/machines/uploadFileMachine.js";
import { useStore } from 'vuex'


export default {
  name: "BaseFileUploadController",
  props: {
    upload: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    const { file, fileId, jobId: uploadId, filename } = props.upload
    const { state, send } = useMachine(uploadFileMachine, {
      context: {
        file,
        uploadId,
        fileId
      },
    });

    const pause = () => send("PAUSE")
    const resume = () => send("RESUME")
    const abort = () => send("ABORT")
    const removeUpload = () => store.dispatch('uploads/remove', props.upload)

    return {
      state,
      filename,
      pause,
      resume,
      abort,
      removeUpload
    }
  }
};
</script>

<style lang="scss">
.upload-controller {
  display: grid;
  grid-template-rows: 3rem 1.1rem;
  grid-template-columns: 1fr 4rem repeat(2, 2.5rem);
  align-items: center;

  column-gap: 1em;

  padding: .3em .2em;

  &__icon {
    cursor: pointer;

    &--pause {
      color: orange;
      grid-column: -3/-2;
    }

    &--play {
      color: green;
      grid-column: -3/-2;
    }

    &--delete {
      color: red;
      grid-column: -2/-1;
    }

    &--uploaded {
      color: green;
      grid-column: -2/-1;
      cursor: auto;
    }

    &--remove {
      color: red;
      grid-column: -2/-1;
    }
  }



  &__file {
    grid-column: 1/ 2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: flex;
    align-items: center;
    gap: .2em;
  }

  &__percentage {
    grid-column: 2/3;
    font-weight: bold;
    justify-self: end;
  }

  &__status {
    grid-column: 1/3;
    grid-row: 2/3;
  }

  &__status-message {
    font-size: 1rem;
  }

  &__progress-bar-container {
    width: 100%;
    height: 5px;
    background-color: rgba(151, 151, 151, 0.965);
  }

  &__progress-bar {
    background-color: rgb(2, 212, 2);
    height: 5px;
    transition: width .2s ease-in-out;
  }

  &__uploaded-msg-container {
    display: flex;
    align-items: center;
  }
}
</style>
