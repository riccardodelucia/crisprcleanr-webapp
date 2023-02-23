<template>
  <template v-if="!state.hasTag('submitting') && !state.matches('submitted')">
    <form ref="form" class="card job-form" @submit.prevent="submit">
      <h2>Submit a new job</h2>
      <ht-form-progress-bar
        :steps="progressSteps"
        :current-step="currentStep"
        class="u-margin-bottom-small"
      >
      </ht-form-progress-bar>

      <template v-if="state.matches('enteringGeneralInfo')">
        <h4>{{ progressSteps[0] }}</h4>
        <div class="form__group">
          <ht-input
            :label="labelFieldPairs.title"
            :model-value="getDataFieldValue(state, 'title')"
            type="text"
            placeholder="Your title here"
            :error="getDataFieldErrorMessage(state, 'title')"
            @update:model-value="onInput($event, 'title')"
          >
          </ht-input>
        </div>

        <div class="form__group">
          <ht-input
            :label="labelFieldPairs.label"
            :model-value="getDataFieldValue(state, 'label')"
            type="text"
            placeholder="Your data label here"
            :error="getDataFieldErrorMessage(state, 'label')"
            @update:model-value="onInput($event, 'label')"
          >
          </ht-input>
        </div>
        <div class="form__group">
          <ht-checkbox
            option="Send email upon job completion"
            :model-value="getDataFieldValue(state, 'sendEmail')"
            @update:model-value="onInput($event, 'sendEmail')"
          >
          </ht-checkbox>
        </div>
        <div class="form__group">
          <ht-textarea
            :label="labelFieldPairs.notes"
            :model-value="getDataFieldValue(state, 'notes')"
            placeholder="Your notes here"
            @update:model-valuee="onInput($event, 'notes')"
          />
        </div>
      </template>

      <template v-if="state.matches('enteringSettings')">
        <h4 class="u-margin-bottom-small">{{ progressSteps[1] }}</h4>
        <div class="form__group">
          <ht-input
            :label="labelFieldPairs.normMinReads"
            :model-value="getDataFieldValue(state, 'normMinReads')"
            type="number"
            :error="getDataFieldErrorMessage(state, 'normMinReads')"
            @update:model-value="onInput($event, 'normMinReads')"
          >
          </ht-input>
        </div>
        <div class="form__group">
          <ht-select
            v-model="normalization"
            :label="labelFieldPairs.method"
            :options="normalizationOptions"
            :error="getDataFieldErrorMessage(state, 'method')"
          >
          </ht-select>
        </div>
      </template>

      <template v-if="state.matches('enteringLibrary')">
        <h4 class="u-margin-bottom-small">{{ progressSteps[2] }}</h4>
        <ht-radio-group
          label="Library type"
          :options="libraryTypeOptions"
          :model-value="libraryType"
          @update:model-value="sendLibraryType"
        >
        </ht-radio-group>
        <template v-if="state.hasTag('libraryBuiltin')">
          <div class="form__group">
            <ht-select
              v-model="libraryBuiltin"
              :label="labelFieldPairs.libraryBuiltin"
              :options="libraryOptions"
              :error="getDataFieldErrorMessage(state, 'libraryBuiltin')"
            >
            </ht-select>
          </div>
        </template>

        <template v-if="state.hasTag('libraryFile')">
          <div class="form__group">
            <ht-input-file
              :label="labelFieldPairs.libraryFile"
              :model-value="getFileFieldValue(state, 'libraryFile')"
              :error="getFileFieldErrorMessage(state, 'libraryFile')"
              @update:model-value="onInput($event, 'libraryFile')"
            >
            </ht-input-file>
          </div>
        </template>
      </template>

      <template v-if="state.matches('enteringFiles')">
        <h4 class="u-margin-bottom-small">{{ progressSteps[3] }}</h4>

        <ht-radio-group
          label="Data type"
          :options="fileTypeOptions"
          :model-value="fileType"
          @update:model-value="sendFileType"
        >
        </ht-radio-group>

        <template v-if="state.hasTag('fileCounts')">
          <div class="form__group">
            <ht-input-file
              :label="labelFieldPairs.fileCounts"
              :model-value="getFileFieldValue(state, 'fileCounts')"
              :error="getFileFieldErrorMessage(state, 'fileCounts')"
              @update:model-value="onInput($event, 'fileCounts')"
            >
            </ht-input-file>
          </div>
          <div class="form__group">
            <ht-input
              :label="labelFieldPairs.nControls"
              :model-value="getDataFieldValue(state, 'nControls')"
              type="number"
              :error="getDataFieldErrorMessage(state, 'nControls')"
              @update:model-value="onInput($event, 'nControls')"
            >
            </ht-input>
          </div>
        </template>

        <template v-if="state.hasTag('filesFASTQ')">
          <div class="form__group">
            <ht-input-file-multiple
              :label="labelFieldPairs.filesFASTQcontrols"
              :model-value="getFileFieldValue(state, 'filesFASTQcontrols')"
              :error="getFileFieldErrorMessage(state, 'filesFASTQcontrols')"
              @update:model-value="onInput($event, 'filesFASTQcontrols')"
            >
            </ht-input-file-multiple>
          </div>

          <div class="form__group">
            <ht-input-file-multiple
              :label="labelFieldPairs.filesFASTQsamples"
              :model-value="getFileFieldValue(state, 'filesFASTQsamples')"
              :error="getFileFieldErrorMessage(state, 'filesFASTQsamples')"
              @update:model-value="onInput($event, 'filesFASTQsamples')"
            >
            </ht-input-file-multiple>
          </div>
        </template>

        <template v-if="state.hasTag('filesBAM')">
          <div class="form__group">
            <ht-input-file-multiple
              :label="labelFieldPairs.filesBAMcontrols"
              :model-value="getFileFieldValue(state, 'filesBAMcontrols')"
              :error="getFileFieldErrorMessage(state, 'filesBAMcontrols')"
              @update:model-value="onInput($event, 'filesBAMcontrols')"
            >
            </ht-input-file-multiple>
          </div>

          <div class="form__group">
            <ht-input-file-multiple
              :label="labelFieldPairs.filesBAMsamples"
              :model-value="getFileFieldValue(state, 'filesBAMsamples')"
              :error="getFileFieldErrorMessage(state, 'filesBAMsamples')"
              @update:model-value="onInput($event, 'filesBAMsamples')"
            >
            </ht-input-file-multiple>
          </div>
        </template>
      </template>

      <template v-if="state.matches('review')">
        <h3>{{ progressSteps[4] }}</h3>
        <ul>
          <li v-for="field in formDataReview(state)" :key="field">
            <b>{{ field[0] }}:</b> {{ field[1] }}
          </li>
        </ul>
      </template>

      <div class="btns-group margin-top--lg">
        <button
          v-if="!state.matches('enteringGeneralInfo')"
          type="button"
          class="btn btn--primary prev-button"
          @click="previous"
        >
          Previous Step
        </button>
        <button
          v-if="!state.matches('review')"
          type="submit"
          class="btn btn--primary next-button"
        >
          Next Step
        </button>
        <button v-else type="submit" class="btn btn--secondary submit-button">
          Submit
        </button>
      </div>
    </form>
  </template>

  <p v-else-if="state.hasTag('submitting')">🚀 Submitting...</p>
</template>

<script>
import { watch, ref, computed, reactive } from 'vue';

import {
  getInterpretedMachine,
  getDataFieldValue,
  getDataFieldErrorMessage,
  getFileFieldValue,
  getFileFieldErrorMessage,
} from '../machines/submitJobMachine';

export default {
  name: 'FormFill',
  props: {
    config: { type: Object, default: () => ({}) },
  },
  emits: { submitted: null },
  setup(props, { emit }) {
    const { state, send } = getInterpretedMachine();

    const onInput = (event, field) => {
      send('INPUT', { payload: event, field });
    };

    const onChange = (event, field) => {
      send('CHANGE', { payload: event, field });
    };

    const submit = () => {
      send('NEXT');
    };

    const previous = () => send('PREVIOUS');

    watch(state, () => {
      if (state.value.matches('submitted')) emit('submitted');
    });

    const labelFieldPairs = {
      title: 'Title',
      sendEmail: 'Send Email',
      label: 'Charts label',
      notes: 'Notes',
      normMinReads: 'Min number of reads in the control sample',
      method: 'Normalization Method',
      libraryBuiltin: 'Built-in Library',
      libraryFile: 'Library Annotation File',
      fileCounts: 'sgRNA Counts File',
      nControls: 'Number of controls',
      filesFASTQcontrols: 'FASTQ Controls',
      filesFASTQsamples: 'FASTQ Samples',
      filesBAMcontrols: 'BAM Controls',
      filesBAMsamples: 'BAM Samples',
    };

    const formDataReview = (state) => {
      const formDataMap = new Map();
      Object.entries(state.context.formData).forEach(([key, field]) => {
        let fieldValue = field;
        if (Array.isArray(field)) {
          fieldValue = field.join(', ');
        }
        formDataMap.set(labelFieldPairs[key], fieldValue);
      });
      return formDataMap;
    };

    const normalizationOptions = reactive([
      {
        method: 'ScalingByTotalReads',
        label: 'Scaling By Total Numbers Of Reads',
      },
      { method: 'MedRatios', label: 'Median Ratios' },
    ]);

    const normalization = ref(normalizationOptions[0]);

    watch(
      normalization,
      () => {
        send('INPUT', {
          payload: normalization.value?.method,
          field: 'method',
        });
      },
      { immediate: true }
    );

    const libraryOptions = reactive([
      { library: 'AVANA_Library', label: 'AVANA' },
      { library: 'Brunello_Library', label: 'Brunello' },
      { library: 'GeCKO_Library_v2', label: 'GeCKO' },
      { library: 'KY_Library_v1.0', label: 'KY v1.0' },
      { library: 'KY_Library_v1.1', label: 'KY v1.1' },
      { library: 'MiniLibCas9_Library', label: 'MiniLibCas9' },
      { library: 'Whitehead_Library', label: 'Whitehead' },
    ]);
    const libraryBuiltin = ref(null);

    watch(
      libraryBuiltin,
      () => {
        send('INPUT', {
          payload: libraryBuiltin.value?.library,
          field: 'libraryBuiltin',
        });
      },
      { immediate: true }
    );

    const libraryTypeArray = [
      { option: 'Built-in', event: 'LIBRARY.BUILTIN' },
      { option: 'Other Library', event: 'LIBRARY.FILE' },
    ];
    const libraryTypeOptions = libraryTypeArray.map((item) => item.option);
    const libraryType = ref('Built-in');

    const sendLibraryType = (option) => {
      libraryType.value = option;
      const event = libraryTypeArray.find((item) => item.option === option)[
        'event'
      ];
      event && send(event);
    };

    const fileTypeArray = [
      { option: 'sgRNA Counts', event: 'FILE.COUNTS' },
      { option: 'FASTQ', event: 'FILE.FASTQ' },
      { option: 'BAM', event: 'FILE.BAM' },
    ];
    const fileTypeOptions = fileTypeArray.map((item) => item.option);
    const fileType = ref(fileTypeArray[0].option);

    const sendFileType = (option) => {
      fileType.value = option;
      const event = fileTypeArray.find((item) => item.option === option)[
        'event'
      ];
      event && send(event);
    };

    const progressSteps = [
      'Job Info',
      'Settings',
      'Library Selection',
      'Files Upload',
      'Review',
    ];
    const currentStep = computed(() => {
      if (state.value.matches('enteringGeneralInfo')) return progressSteps[0];
      if (state.value.matches('enteringSettings')) return progressSteps[1];
      if (state.value.matches('enteringLibrary')) return progressSteps[2];
      if (state.value.matches('enteringFiles')) return progressSteps[3];
      if (state.value.matches('review')) return progressSteps[4];
      return progressSteps[0];
    });

    return {
      state,
      onInput,
      onChange,
      previous,
      submit,
      getDataFieldValue,
      getDataFieldErrorMessage,
      normalizationOptions,
      normalization,
      getFileFieldValue,
      getFileFieldErrorMessage,
      sendLibraryType,
      sendFileType,
      labelFieldPairs,
      formDataReview,
      libraryTypeOptions,
      libraryType,
      libraryOptions,
      libraryBuiltin,
      fileTypeOptions,
      fileType,
      progressSteps,
      currentStep,
    };
  },
};
</script>

<style lang="scss" scoped>
.job-form {
  max-width: 50rem;
  margin: var(--space-lg);
}

.prev-button,
.next-button,
.submit-button {
  width: 18rem;
}

.next-button {
  margin-left: auto;
}
</style>
