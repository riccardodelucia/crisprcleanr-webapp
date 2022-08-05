<template>
  <template v-if="!state.hasTag('submitting') && !state.matches('submitted')">
    <form class="widget job-form" ref="form" @submit.prevent="submit">
      <h2 class="u-margin-bottom-small">Submit a new job</h2>
      <BaseFormProgressBar :steps="progressSteps" :currentStep="currentStep"></BaseFormProgressBar>

      <template v-if="state.matches('enteringGeneralInfo')">
        <h3 class="u-margin-bottom-small">General Info</h3>
        <div class="form__group">
          <BaseInput :label="labelFieldPairs.title" @update:modelValue="onInput($event, 'title')"
            :modelValue="getDataFieldValue(state, 'title')" type="text" placeholder="Your title here"
            :error="getDataFieldErrorMessage(state, 'title')">
          </BaseInput>
        </div>
        <div class="form__group">
          <BaseInput :label="labelFieldPairs.email" @change="onChange($event, 'email')"
            :modelValue="getDataFieldValue(state, 'email')" type="email" placeholder="Your email here"
            :error="getDataFieldErrorMessage(state, 'email')">
          </BaseInput>
        </div>
        <div class="form__group">
          <BaseInput :label="labelFieldPairs.label" @input="onInput($event, 'label')"
            :modelValue="getDataFieldValue(state, 'label')" type="text" placeholder="Your data label here"
            :error="getDataFieldErrorMessage(state, 'label')">
          </BaseInput>
        </div>
        <div class="form__group">
          <BaseTextarea :label="labelFieldPairs.notes" @input="onInput($event, 'notes')"
            :modelValue="getDataFieldValue(state, 'notes')" placeholder="Your notes here" />
        </div>
      </template>


      <template v-if="state.matches('enteringSettings')">
        <h3 class="u-margin-bottom-small">Settings</h3>
        <div class="form__group">
          <BaseInput :label="labelFieldPairs.normMinReads" @update:modelValue="onInput($event, 'normMinReads')"
            :modelValue="getDataFieldValue(state, 'normMinReads')" type="number"
            :error="getDataFieldErrorMessage(state, 'normMinReads')">
          </BaseInput>
        </div>
        <div class="form__group">
          <BaseSelect :label="labelFieldPairs.method" :options="normalizationOptions" v-model="normalization"
            :error="getDataFieldErrorMessage(state, 'method')">
          </BaseSelect>
        </div>
      </template>


      <template v-if="state.matches('enteringLibrary')">
        <h3 class="u-margin-bottom-small">Library</h3>
        <BaseRadioGroup label="Library type" :options="libraryTypeOptions" @update:modelValue="sendLibraryType"
          :modelValue="libraryType">
        </BaseRadioGroup>
        <template v-if="state.hasTag('libraryBuiltin')">
          <div class="form__group">
            <BaseSelect :label="labelFieldPairs.libraryBuiltin" :options="libraryOptions" v-model="libraryBuiltin"
              :error="getDataFieldErrorMessage(state, 'libraryBuiltin')">
            </BaseSelect>
          </div>
        </template>


        <template v-if="state.hasTag('libraryFile')">
          <div class="form__group">
            <BaseInputFile :label="labelFieldPairs.libraryFile" @update:modelValue="onInput($event, 'libraryFile')"
              :modelValue="getFileFieldValue(state, 'libraryFile')"
              :error="getFileFieldErrorMessage(state, 'libraryFile')">
            </BaseInputFile>
          </div>
        </template>

      </template>


      <template v-if="state.matches('enteringFiles')">
        <h3 class="u-margin-bottom-small">Input Files</h3>

        <BaseRadioGroup label="File type" :options="fileTypeOptions" @update:modelValue="sendFileType"
          :modelValue="fileType">
        </BaseRadioGroup>

        <template v-if="state.hasTag('fileCounts')">
          <div class="form__group">
            <BaseInputFile :label="labelFieldPairs.fileCounts" @update:modelValue="onInput($event, 'fileCounts')"
              :modelValue="getFileFieldValue(state, 'fileCounts')"
              :error="getFileFieldErrorMessage(state, 'fileCounts')">
            </BaseInputFile>
          </div>
          <div class="form__group">
            <BaseInput :label="labelFieldPairs.nControls" @update:modelValue="onInput($event, 'nControls')"
              :modelValue="getDataFieldValue(state, 'nControls')" type="number"
              :error="getDataFieldErrorMessage(state, 'nControls')">
            </BaseInput>
          </div>
        </template>

        <template v-if="state.hasTag('filesFASTQ')">
          <div class="form__group">
            <BaseInputFileMultiple :label="labelFieldPairs.filesFASTQcontrols"
              @update:modelValue="onInput($event, 'filesFASTQcontrols')"
              :modelValue="getFileFieldValue(state, 'filesFASTQcontrols')"
              :error="getFileFieldErrorMessage(state, 'filesFASTQcontrols')">
            </BaseInputFileMultiple>
          </div>

          <div class="form__group">
            <BaseInputFileMultiple :label="labelFieldPairs.filesFASTQsamples"
              @update:modelValue="onInput($event, 'filesFASTQsamples')"
              :modelValue="getFileFieldValue(state, 'filesFASTQsamples')"
              :error="getFileFieldErrorMessage(state, 'filesFASTQsamples')">
            </BaseInputFileMultiple>
          </div>
        </template>

        <template v-if="state.hasTag('filesBAM')">
          <div class="form__group">
            <BaseInputFileMultiple :label="labelFieldPairs.filesBAMcontrols"
              @update:modelValue="onInput($event, 'filesBAMcontrols')"
              :modelValue="getFileFieldValue(state, 'filesBAMcontrols')"
              :error="getFileFieldErrorMessage(state, 'filesBAMcontrols')">
            </BaseInputFileMultiple>
          </div>

          <div class="form__group">
            <BaseInputFileMultiple :label="labelFieldPairs.filesBAMsamples"
              @update:modelValue="onInput($event, 'filesBAMsamples')"
              :modelValue="getFileFieldValue(state, 'filesBAMsamples')"
              :error="getFileFieldErrorMessage(state, 'filesBAMsamples')">
            </BaseInputFileMultiple>
          </div>

        </template>
      </template>


      <template v-if="state.matches('review')">
        <h3 class="u-margin-bottom-small">Review Data</h3>
        <ul v-for="field in formDataReview(state)" :key="field">
          <li>
            <b>{{ field[0] }}:</b> {{ field[1] }}
          </li>
        </ul>
      </template>

      <div class="job-form__button-container">
        <button type="button" class="button button--primary button--large prev-button" @click="previous"
          v-if="!state.matches('enteringGeneralInfo')">
          Previous
        </button>
        <button v-if="!state.matches('review')" type="submit" class="button button--primary button--large next-button">
          Next
        </button>
        <button v-else type="submit" class="button button--primary button--large next-button">
          Submit
        </button>
      </div>

    </form>
  </template>

  <p v-else-if="state.hasTag('submitting')">
    🚀 Submitting...
  </p>

</template>

<script>
import { watch, ref, computed, reactive } from "vue";

import { getInterpretedMachine, getDataFieldValue, getDataFieldErrorMessage, getFileFieldValue, getFileFieldErrorMessage } from "../../machines/submitJobMachine";

export default {
  name: "FormFill",
  props: {
    config: { type: Object },
  },
  setup(props, { emit }) {

    const { state, send } = getInterpretedMachine();

    const onInput = (event, field) => {
      send("INPUT", { payload: event, field });
    };

    const onChange = (event, field) => {
      send("CHANGE", { payload: event, field });
    };

    const submit = (event, field) => {
      send("NEXT");
    };

    const previous = () => send("PREVIOUS");

    watch(state, () => {
      if (state.value.matches("submitted")) emit("submitted")
    })

    const labelFieldPairs = {
      title: "Title",
      email: "Email (optional)",
      label: "Data label",
      notes: "Notes",
      normMinReads: "Min number of reads in the control sample",
      method: "Normalization Method",
      libraryBuiltin: "Default Library",
      libraryFile: "Library File",
      fileCounts: "Counts File",
      nControls: "Number of controls",
      filesFASTQcontrols: "FASTQ Controls",
      filesFASTQsamples: "FASTQ Samples",
      filesBAMcontrols: "BAM Controls",
      filesBAMsamples: "BAM Samples"
    }

    const formDataReview = (state) => {
      const formDataMap = new Map();
      Object.entries(state.context.formData).forEach(([key, field]) => {
        let fieldValue = field
        if (Array.isArray(field)) {
          fieldValue = field.join(", ")
        }
        formDataMap.set(labelFieldPairs[key], fieldValue)
      })
      return formDataMap;
    }

    const normalizationOptions = reactive([{ method: "CPM", label: "Counts Per Million" }, { method: "MedRatios", label: "Median Ratios" }])

    const normalization = ref(normalizationOptions[0])

    watch(normalization, () => {
      send("INPUT", { payload: normalization.value?.method, field: "method" });
    }, { immediate: true })

    const libraryOptions = reactive([{ library: "AVANA_Library", label: "AVANA" }, { library: "Brunello_Library", label: "Brunello" }, { library: "GeCKO_Library_v2", label: "GeCKO" }, { library: "KY_Library_v1.1", label: "KY v1.1" }, { library: "MiniLibCas9_Library", label: "MiniLibCas9" }, { library: "Whitehead_Library", label: "Whitehead" }])
    const libraryBuiltin = ref(null)

    watch(libraryBuiltin, () => {
      send("INPUT", { payload: libraryBuiltin.value?.library, field: "libraryBuiltin" });
    }, { immediate: true })

    const libraryTypeArray = [{ option: 'Default', event: "LIBRARY.DEFAULT" }, { option: 'File', event: "LIBRARY.FILE" }];
    const libraryTypeOptions = libraryTypeArray.map(item => item.option)
    const libraryType = ref("Default")

    const sendLibraryType = (option) => {
      libraryType.value = option
      const event = libraryTypeArray.find(item => item.option === option)["event"]
      event && send(event)
    }

    const fileTypeArray = [{ option: 'Raw Counts', event: "FILE.COUNTS" }, { option: 'FASTQ', event: "FILE.FASTQ" }, { option: 'BAM', event: "FILE.BAM" }];
    const fileTypeOptions = fileTypeArray.map(item => item.option)
    const fileType = ref("Raw Counts")

    const sendFileType = (option) => {
      fileType.value = option
      const event = fileTypeArray.find(item => item.option === option)["event"]
      event && send(event)
    }

    const progressSteps = ["General", "Settings", "Library", "Files", "Review"]
    const currentStep = computed(() => {
      if (state.value.matches('enteringGeneralInfo')) return progressSteps[0]
      if (state.value.matches('enteringSettings')) return progressSteps[1]
      if (state.value.matches('enteringLibrary')) return progressSteps[2]
      if (state.value.matches('enteringFiles')) return progressSteps[3]
      if (state.value.matches('review')) return progressSteps[4]
    })

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
  display: flex;
  flex-direction: column;
}

.job-form__button-container {
  display: flex;
  justify-content: space-between;
  margin-top: 1em;
}

.next-button {
  margin-left: auto;
}
</style>
