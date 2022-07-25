<template>
  <template v-if="!state.hasTag('submitting') && !state.matches('submitted')">
    <form class="widget job-form" ref="form" @submit.prevent="submit">
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
          <BaseInput :label="labelFieldPairs.nControls" @update:modelValue="onInput($event, 'nControls')"
            :modelValue="getDataFieldValue(state, 'nControls')" type="number"
            :error="getDataFieldErrorMessage(state, 'nControls')">
          </BaseInput>
        </div>
        <div class="form__group">
          <BaseInput :label="labelFieldPairs.normMinReads" @update:modelValue="onInput($event, 'normMinReads')"
            :modelValue="getDataFieldValue(state, 'normMinReads')" type="number"
            :error="getDataFieldErrorMessage(state, 'normMinReads')">
          </BaseInput>
        </div>
        <div class="form__group">
          <BaseSelect :label="labelFieldPairs.method" :options="config.methods"
            @update:modelValue="onInput($event, 'method')" :modelValue="getDataFieldValue(state, 'method')"
            :error="getDataFieldErrorMessage(state, 'method')" default="Counts Per Million">
          </BaseSelect>
        </div>
      </template>


      <template v-if="state.matches('enteringLibrary')">
        <h3 class="u-margin-bottom-small">Library</h3>
        <input type="radio" id="html" name="fav_language" value="Default Library" @click="send('LIBRARY.DEFAULT')">
        <label for="html">Default Library</label><br>
        <input type="radio" id="css" name="fav_language" value="Upload Library File" @click="send('LIBRARY.FILE')">
        <label for="css">Upload Library file</label><br>

        <template v-if="state.hasTag('libraryBuiltin')">
          <div class="form__group">
            <BaseSelect :label="labelFieldPairs.libraryBuiltin" :options="config.libraries"
              @update:modelValue="onInput($event, 'libraryBuiltin')"
              :modelValue="getDataFieldValue(state, 'libraryBuiltin')"
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

        <input type="radio" id="counts" name="fav_language" value="File Counts" @click="send('FILE.COUNTS')">
        <label for="counts">File Counts</label><br>
        <input type="radio" id="fastq" name="fav_language" value="Files FASTQ" @click="send('FILE.FASTQ')">
        <label for="fastq">Files FASTQ</label><br>
        <input type="radio" id="bam" name="fav_language" value="Files BAM" @click="send('FILE.BAM')">
        <label for="bam">Files BAM</label><br>

        <template v-if="state.hasTag('fileCounts')">
          <div class="form__group">
            <BaseInputFile :label="labelFieldPairs.fileCounts" @update:modelValue="onInput($event, 'fileCounts')"
              :modelValue="getFileFieldValue(state, 'fileCounts')"
              :error="getFileFieldErrorMessage(state, 'fileCounts')">
            </BaseInputFile>
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
            <p> {{ field[0] }}:<br /> {{ field[1] }}</p>
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
import { watch } from "vue";
import { useRouter } from "vue-router";

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
      nControls: "Number of controls",
      normMinReads: "Minimal number of reads in the control sample",
      method: "Normalization Method",
      libraryBuiltin: "Default Library",
      libraryFile: "Library File",
      fileCounts: "Counts File",
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

    return {
      state,
      onInput,
      onChange,
      previous,
      submit,
      getDataFieldValue,
      getDataFieldErrorMessage,
      getFileFieldValue,
      getFileFieldErrorMessage,
      send,
      labelFieldPairs,
      formDataReview,
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
