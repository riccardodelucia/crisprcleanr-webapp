<template>
  <template v-if="!state.hasTag('submitting') && !state.matches('submitted')">
    <div class="ht-card ht-container ht-layout-stack">
      <h1>Submit a new job</h1>
      <ht-form-progress-bar :steps="progressSteps" :current-step="currentStep">
      </ht-form-progress-bar>
      <form @submit.prevent="submit">
        <template v-if="state.matches('enteringGeneralInfo')">
          <h2>{{ progressSteps[0] }}</h2>
          <ht-input class="ht-formgroup" :label="labelFieldPairs.title" :model-value="getDataFieldValue(state, 'title')"
            type="text" placeholder="Your title here" :error="getDataFieldErrorMessage(state, 'title')"
            @update:model-value="onInput($event, 'title')">
          </ht-input>
          <ht-input class="ht-formgroup" :label="labelFieldPairs.label" :model-value="getDataFieldValue(state, 'label')"
            type="text" placeholder="Your data label here" :error="getDataFieldErrorMessage(state, 'label')"
            @update:model-value="onInput($event, 'label')">
          </ht-input>
          <ht-checkbox class="ht-formgroup" option="Send email upon job completion"
            :model-value="getDataFieldValue(state, 'sendEmail')" @update:model-value="onInput($event, 'sendEmail')">
          </ht-checkbox>
          <ht-textarea class="ht-formgroup" :label="labelFieldPairs.notes"
            :model-value="getDataFieldValue(state, 'notes')" placeholder="Your notes here"
            @update:model-value="onInput($event, 'notes')" />
        </template>

        <template v-if="state.matches('enteringSettings')">
          <h2>{{ progressSteps[1] }}</h2>
          <ht-input class="ht-formgroup" :label="labelFieldPairs.normMinReads"
            :model-value="getDataFieldValue(state, 'normMinReads')" type="number"
            :error="getDataFieldErrorMessage(state, 'normMinReads')"
            @update:model-value="onInput($event, 'normMinReads')">
          </ht-input>
          <ht-select v-model="normalization" class="ht-formgroup" :label="labelFieldPairs.method"
            :options="normalizationOptions" :error="getDataFieldErrorMessage(state, 'method')">
          </ht-select>
        </template>

        <template v-if="state.matches('enteringLibrary')">
          <h2>{{ progressSteps[2] }}</h2>
          <ht-radio-group class="ht-formgroup" label="Library type" :options="libraryTypeOptions"
            :model-value="libraryType" @update:model-value="sendLibraryType">
          </ht-radio-group>
          <ht-select v-if="state.hasTag('libraryBuiltin')" v-model="libraryBuiltin" class="ht-formgroup"
            :label="labelFieldPairs.libraryBuiltin" :options="libraryOptions"
            :error="getDataFieldErrorMessage(state, 'libraryBuiltin')">
          </ht-select>
          <ht-input-file v-if="state.hasTag('libraryFile')" :label="labelFieldPairs.libraryFile"
            :model-value="getFileFieldValue(state, 'libraryFile')" :error="getFileFieldErrorMessage(state, 'libraryFile')"
            @update:model-value="onInput($event, 'libraryFile')">
          </ht-input-file>
        </template>

        <template v-if="state.matches('enteringFiles')">
          <h2>{{ progressSteps[3] }}</h2>
          <ht-radio-group class="ht-formgroup" label="Data type" :options="fileTypeOptions" :model-value="fileType"
            @update:model-value="sendFileType">
          </ht-radio-group>
          <template v-if="state.hasTag('fileCounts')">
            <ht-input-file class="ht-formgroup" :label="labelFieldPairs.fileCounts"
              :model-value="getFileFieldValue(state, 'fileCounts')" :error="getFileFieldErrorMessage(state, 'fileCounts')"
              @update:model-value="onInput($event, 'fileCounts')">
            </ht-input-file>
            <ht-input class="ht-formgroup" :label="labelFieldPairs.nControls"
              :model-value="getDataFieldValue(state, 'nControls')" type="number"
              :error="getDataFieldErrorMessage(state, 'nControls')" @update:model-value="onInput($event, 'nControls')">
            </ht-input>
          </template>

          <template v-if="state.hasTag('filesFASTQ')">
            <ht-input-file class="ht-formgroup" multiple :label="labelFieldPairs.filesFASTQcontrols"
              :model-value="getFileFieldValue(state, 'filesFASTQcontrols')"
              :error="getFileFieldErrorMessage(state, 'filesFASTQcontrols')"
              @update:model-value="onInput($event, 'filesFASTQcontrols')">
            </ht-input-file>
            <ht-input-file class="ht-formgroup" multiple :label="labelFieldPairs.filesFASTQsamples"
              :model-value="getFileFieldValue(state, 'filesFASTQsamples')"
              :error="getFileFieldErrorMessage(state, 'filesFASTQsamples')"
              @update:model-value="onInput($event, 'filesFASTQsamples')">
            </ht-input-file>
          </template>

          <template v-if="state.hasTag('filesBAM')">
            <ht-input-file class="ht-formgroup" multiple :label="labelFieldPairs.filesBAMcontrols"
              :model-value="getFileFieldValue(state, 'filesBAMcontrols')"
              :error="getFileFieldErrorMessage(state, 'filesBAMcontrols')"
              @update:model-value="onInput($event, 'filesBAMcontrols')">
            </ht-input-file>
            <ht-input-file class="ht-formgroup" multiple :label="labelFieldPairs.filesBAMsamples"
              :model-value="getFileFieldValue(state, 'filesBAMsamples')"
              :error="getFileFieldErrorMessage(state, 'filesBAMsamples')"
              @update:model-value="onInput($event, 'filesBAMsamples')">
            </ht-input-file>
          </template>
        </template>

        <template v-if="state.matches('review')">
          <h2>{{ progressSteps[4] }}</h2>
          <ul>
            <li v-for="field in formDataReview(state)" :key="field">
              <b>{{ field[0] }}:</b> {{ field[1] }}
            </li>
          </ul>
        </template>

        <div class="buttons-container">
          <button v-if="!state.matches('enteringGeneralInfo')" type="button" @click="previous">
            Previous Step
          </button>
          <button v-if="!state.matches('review')" type="submit" class="next-button">
            Next Step
          </button>
          <button v-else type="submit" class="next-button" data-type="secondary">
            Submit
          </button>
        </div>
      </form>
    </div>
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

<style lang="postcss" scoped>
@import '@computational-biology-sw-web-dev-unit/ht-design/style.css';

h1 {
  color: var(--ht-text-color-2);
  font-size: var(--font-size-5);
}

h2 {
  color: var(--ht-text-color-1);
  font-size: var(--font-size-4);
}

.buttons-container {
  display: flex;
  gap: var(--flex-gap, 1em);
  justify-content: space-between;

  margin-top: var(--size-7);

  & button:only-child {
    margin-left: auto;
  }
}

.ht-card {
  max-width: 50rem;
}
</style>
