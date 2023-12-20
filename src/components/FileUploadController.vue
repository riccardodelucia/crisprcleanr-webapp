<template>
  <div class="upload">
    <span class="upload__filename">
      {{ filename }}
    </span>
    <template v-if="errorMessage">
      <div class="upload__progress">
        <p class="red">{{ errorMessage }}</p>
      </div>

      <ht-button-icon
        type="button"
        icon-type="x-circle"
        width="20px"
        @click="$emit('remove-upload', upload)"
      >
      </ht-button-icon>
    </template>
    <template v-else>
      <span
        v-if="state.matches('uploading') || state.matches('uploaded')"
        class="upload__percentage"
        >{{ state.context.percentage }}%</span
      >
      <ht-button-icon
        v-if="state.matches('uploading')"
        type="button"
        icon-type="trash-2"
        width="20px"
        @click="send('ABORT')"
      >
      </ht-button-icon>
      <ht-button-icon
        v-else
        type="button"
        icon-type="x-circle"
        width="20px"
        @click="$emit('remove-upload', upload)"
      >
      </ht-button-icon>
      <div class="upload__progress">
        <ht-progress
          v-if="state.matches('uploading')"
          :value="state.context.percentage"
        ></ht-progress>
        <p v-else-if="state.matches('uploaded')" class="green">Uploaded</p>
        <p
          v-else-if="state.matches('aborted') || state.matches('error')"
          class="red"
        >
          {{ state.context.errorMessage }}
        </p>
      </div>
    </template>
  </div>
</template>

<script>
import { toRaw } from 'vue';
import { useMachine } from '@xstate/vue';
import { createMachine, assign } from 'xstate';

////////////////////////////////////////////////////////////////
// SERVICES
const uploadFile =
  ({ upload }) =>
  (callback) => {
    const progressCallback = (progress) =>
      callback({
        type: 'PROGRESS',
        progress,
      });

    const uploadedCallback = () =>
      callback({
        type: 'UPLOADED',
      });

    const errorCallback = (error) =>
      callback({
        type: 'ERROR',
        payload: { error },
      });

    const { instance, config } = upload;

    instance.interceptors.request.use((config) => {
      config.onUploadProgress = progressCallback;
      return config;
    });
    instance(config)
      .then(uploadedCallback)
      .catch((error) => {
        errorCallback(error);
      });

    return () => {};
  };

////////////////////////////////////////////////////////////////
// ACTIONS
const assignProgress = assign(
  (
    {
      upload: {
        file: { size },
      },
    },
    { progress }
  ) => {
    const totalFileBytesUploaded = progress.loaded;
    const percentage = Math.min(
      Math.round((totalFileBytesUploaded * 100) / size),
      99
    );
    return {
      totalFileBytesUploaded,
      percentage,
    };
  }
);

const assignProgress100 = assign({
  percentage: () => 100,
});

const assignErrorMessage = assign({
  errorMessage: (context, event) =>
    event.payload.error?.message || 'Upload error',
});

const assignAbortMessage = assign({
  errorMessage: () => 'canceled',
});

const abortUpload = ({ upload: { controller } }) => {
  controller.abort();
};

////////////////////////////////////////////////////////////////
// GUARDS
/* const warnAbort = () =>
  window.confirm(
    "This action will permanently delete the file upload. Your job will not be able to be computed. Are you sure?"
  ); */

const uploadFileMachine = createMachine({
  predictableActionArguments: true,
  context: {
    upload: {},
    totalFileBytesUploaded: 0,
    percentage: 0,
    errorMessage: '', //filled only if an error occurs during the upload
  },
  initial: 'uploading',
  states: {
    uploading: {
      invoke: {
        id: 'uploadFile',
        src: 'uploadFile',
      },
      on: {
        PROGRESS: { actions: ['assignProgress'] },
        ABORT: {
          target: 'aborted',
          //cond: "warnAbort",
          actions: ['abortUpload'],
        },
        ERROR: {
          target: 'error',
        },
        UPLOADED: {
          target: 'uploaded',
        },
      },
    },
    uploaded: { type: 'final', entry: ['assignProgress100'] },
    aborted: {
      type: 'final',
      entry: ['assignAbortMessage'],
    },
    error: {
      type: 'final',
      entry: ['assignErrorMessage'],
    },
    idle: {
      on: {
        RESUME: {
          target: 'uploading',
        },
      },
    },
  },
}).withConfig({
  services: {
    uploadFile,
  },
  actions: {
    assignProgress,
    assignProgress100,
    assignErrorMessage,
    assignAbortMessage,
    abortUpload,
  },
});

export default {
  name: 'FileUploadController',
  //components: { ht-button-icon, ht-progress },
  props: {
    upload: {
      type: Object,
      required: true,
    },
  },
  emits: ['remove-upload'],
  setup(props) {
    const upload = toRaw(props.upload); //to remove proxies from reactive props

    const { filename } = upload;
    let state, send;

    const errorMessage = upload?.errorMessage;

    if (!errorMessage) {
      const machine = useMachine(uploadFileMachine, {
        context: {
          upload,
        },
      });
      state = machine.state;
      send = machine.send;
    }

    return {
      state,
      filename,
      send,
      errorMessage,
    };
  },
};
</script>

<style lang="postcss" scoped>
.upload {
  margin-bottom: var(--size-3);
  display: grid;
  align-items: center;
  grid-template-columns: 1fr 3rem 2rem;

  grid-template-areas:
    'filename percentage button'
    'progress progress progress';

  grid-column-gap: var(--size-2);

  background-color: var(--upload-background-color, var(--ht-surface-1));

  &__filename {
    grid-area: filename;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__percentage {
    grid-area: percentage;
  }

  button {
    grid-area: button;
    color: var(--ht-color-red);
  }
  button:hover {
    color: var(--ht-color-red);
  }

  &__progress {
    grid-area: progress;
    height: 1rem;

    p {
      font-size: var(--font-size-0);
      line-height: 1;
    }

    .green {
      color: var(--ht-color-green);
    }

    .red {
      color: var(--ht-color-red);
    }
  }
}
</style>
