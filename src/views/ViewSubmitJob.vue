<template>
  <AppLayout>
    <div class="app-content">
      <div class="ht-card ht-container ht-layout-stack">
        <h1>Submit a new job</h1>
        {{ values }}
        <ht-form-progress-bar
          :steps="progressSteps"
          :current-step="currentStep"
        >
        </ht-form-progress-bar>
        <form @submit="onSubmit">
          <template v-if="state.matches('enteringGeneralInfo')">
            <h2>{{ progressSteps[0] }}</h2>

            <div class="formgroup">
              <InputField name="title" type="text" label="Title" />
            </div>
            <div class="formgroup-inline">
              <InputCheckbox
                name="sendEmail"
                label="Send Email"
                :value="true"
              />
            </div>
            <div class="formgroup">
              <InputField name="label" type="text" label="Label" />
            </div>
          </template>

          <template v-if="state.matches('enteringSettings')">
            <h2>{{ progressSteps[1] }}</h2>

            <div class="formgroup">
              <InputField
                name="normMinReads"
                type="number"
                label="Min number of reads in the control sample"
              />
            </div>
            <div class="formgroup">
              <InputSelect
                label="Normalization Method"
                :options="methodOptions"
                name="method"
              ></InputSelect>
            </div>
          </template>
          <template v-if="state.matches('enteringLibrary')">
            <h2>{{ progressSteps[2] }}</h2>

            <div class="formgroup-inline">
              <ht-radio-group
                name="library"
                :options="libraryOptions"
                :model-value="library"
                @update:model-value="onRadioChange('library', $event)"
              >
              </ht-radio-group>
            </div>

            <div v-if="state.hasTag('libraryBuiltin')" class="formgroup">
              <InputSelect
                label="Built-in Library"
                :options="libraryBuiltinOptions"
                name="libraryBuiltin"
              ></InputSelect>
            </div>

            <div v-if="state.hasTag('libraryFile')" class="formgroup">
              <InputFile
                v-model:files="libraryFileModel"
                name="libraryFile"
                label="Library Annotation File"
              />
            </div>
          </template>
          <template v-if="state.matches('enteringFiles')">
            <h2>{{ progressSteps[3] }}</h2>

            <div class="formgroup-multiple-inline">
              <ht-radio-group
                name="Data type"
                :options="fileTypeOptions"
                :model-value="fileType"
                @update:model-value="onRadioChange('fileType', $event)"
              >
              </ht-radio-group>
            </div>
            <template v-if="state.hasTag('fileCounts')">
              <div class="formgroup">
                <InputFile
                  v-model:files="fileCountsModel"
                  name="fileCounts"
                  label="sgRNA Counts File"
                />
              </div>
              <div class="formgroup">
                <InputField
                  name="nControls"
                  type="number"
                  label="Number of controls"
                />
              </div>
            </template>

            <template v-if="state.hasTag('filesFASTQ')">
              <div class="formgroup">
                <InputFile
                  v-model:files="filesFASTQcontrolsModel"
                  name="filesFASTQcontrols"
                  multiple
                  label="FASTQ Controls"
                />
              </div>
              <div class="formgroup">
                <InputFile
                  v-model:files="filesFASTQsamplesModel"
                  name="filesFASTQsamples"
                  multiple
                  label="FASTQ Samples"
                />
              </div>
            </template>

            <template v-if="state.hasTag('filesBAM')">
              <div class="formgroup">
                <InputFile
                  v-model:files="filesBAMcontrolsModel"
                  name="filesBAMcontrols"
                  multiple
                  label="BAM Controls"
                />
              </div>
              <div class="formgroup">
                <InputFile
                  v-model:files="filesBAMsamplesModel"
                  name="filesBAMsamples"
                  multiple
                  label="BAM Samples"
                />
              </div>
            </template>
          </template>

          <template v-if="state.matches('review.idle')">
            <h2>{{ progressSteps[4] }}</h2>
            <ul>
              <li
                v-for="(item, idx) in Object.entries(state.context.submitData)"
                :key="`review-${idx}`"
              >
                <b>{{ item[0] }}: </b>{{ item[1] }}
              </li>
            </ul>
          </template>
          <p v-else-if="state.matches('review.submitting')">🚀 Submitting...</p>
          <template v-else-if="state.matches('submitted')">
            <h2>Job submitted</h2>
            <p>JobId: {{ state.context.jobId }}</p>
          </template>
          <template v-else-if="state.matches('review.submissionError')">
            <h2>Job submission error</h2>
            <p>{{ state.context.submissionErrorMessage }}</p>
          </template>

          <div class="buttons-container">
            <template
              v-if="
                !state.matches('review.submitting') &&
                !state.matches('submitted') &&
                !state.matches('review.submissionError')
              "
            >
              <button
                v-if="!state.matches('enteringGeneralInfo')"
                type="button"
                @click="send('PREVIOUS')"
              >
                Previous Step
              </button>
              <button
                v-if="!state.matches('review')"
                type="submit"
                class="next-button"
              >
                Next Step
              </button>
              <button
                v-else-if="state.matches('review')"
                type="submit"
                class="next-button"
                data-type="secondary"
              >
                Submit
              </button>
            </template>

            <button
              v-else-if="state.matches('submitted')"
              data-type="secondary"
              @click="send('RESTART')"
            >
              Submit another Job
            </button>
            <template v-else-if="state.matches('review.submissionError')">
              <button data-type="primary" @click="send('RESTART')">
                Submit another Job
              </button>
              <button data-type="secondary" @click="send('RETRY')">
                Retry
              </button>
            </template>
          </div>
        </form>
      </div>
    </div>
  </AppLayout>
</template>

<script>
import AppLayout from '@/layouts/AppLayout.vue';
import InputField from '@/components/InputField.vue';
import InputCheckbox from '@/components/InputCheckbox.vue';
import InputSelect from '@/components/InputSelect.vue';
import InputFile from '@/components/InputFile.vue';

import { string, number, array, bool, object } from 'yup';

import { ref, computed } from 'vue';

import { useForm } from 'vee-validate';

import { getInterpretedMachine } from '@/submitJobMachine.js';

const collectAllFiles = ({
  filesFASTQcontrolsModel,
  filesFASTQsamplesModel,
  filesBAMcontrolsModel,
  filesBAMsamplesModel,
  libraryFileModel,
  fileCountsModel,
}) => {
  const filesFASTQcontrolsModelArray = filesFASTQcontrolsModel
    ? Array.from(filesFASTQcontrolsModel)
    : [];

  const filesFASTQsamplesModelArray = filesFASTQsamplesModel
    ? Array.from(filesFASTQsamplesModel)
    : [];

  const filesBAMcontrolsModelArray = filesBAMcontrolsModel
    ? Array.from(filesBAMcontrolsModel)
    : [];

  const filesBAMsamplesModelArray = filesBAMsamplesModel
    ? Array.from(filesBAMsamplesModel)
    : [];

  const formFiles = [
    ...filesFASTQcontrolsModelArray,
    ...filesFASTQsamplesModelArray,
    ...filesBAMcontrolsModelArray,
    ...filesBAMsamplesModelArray,
  ];

  libraryFileModel && formFiles.push(libraryFileModel);
  fileCountsModel && formFiles.push(fileCountsModel);

  return formFiles;
};

export default {
  title: 'Submit New Job',
  name: 'ViewCRISPRcleanRSubmitJob',
  components: {
    AppLayout,
    InputField,
    InputCheckbox,
    InputSelect,
    InputFile,
  },
  setup() {
    const { state, send, service } = getInterpretedMachine();

    const progressSteps = [
      'Job Info',
      'Settings',
      'Library Selection',
      'Files Upload',
      'Review',
    ];

    ///////////////////////////////////////////////
    // LIBRARY FORM SECTION
    const libraryOptions = [
      { label: 'Built-in', value: 'LIBRARY.BUILTIN' },
      { label: 'Other Library', value: 'LIBRARY.FILE' },
    ];

    const libraryBuiltinOptions = [
      { value: 'AVANA_Library', label: 'AVANA' },
      { value: 'Brunello_Library', label: 'Brunello' },
      { value: 'GeCKO_Library_v2', label: 'GeCKO' },
      { value: 'KY_Library_v1.0', label: 'KY v1.0' },
      { value: 'KY_Library_v1.1', label: 'KY v1.1' },
      { value: 'MiniLibCas9_Library', label: 'MiniLibCas9' },
      { value: 'Whitehead_Library', label: 'Whitehead' },
    ];

    const library = ref(libraryOptions[0].value);
    const libraryFileModel = ref(null);

    ///////////////////////////////////////////////
    // FILES FORM SECTION
    const fileTypeOptions = [
      { label: 'sgRNA Counts', value: 'FILE.COUNTS' },
      { label: 'FASTQ', value: 'FILE.FASTQ' },
      { label: 'BAM', value: 'FILE.BAM' },
    ];

    const fileType = ref(fileTypeOptions[0].value);
    const fileCountsModel = ref(null);

    const filesFASTQcontrolsModel = ref(null);
    const filesFASTQsamplesModel = ref(null);

    const filesBAMcontrolsModel = ref(null);
    const filesBAMsamplesModel = ref(null);

    ///////////////////////////////////////////////
    const onRadioChange = (field, value) => {
      const dictionary = {
        library,
        fileType,
      };
      dictionary[field].value = value;
      send(value);
    };

    const currentStep = ref(progressSteps[0]);

    service.onTransition((state) => {
      if (state.matches('enteringGeneralInfo')) {
        currentStep.value = progressSteps[0];
      }

      if (state.matches('enteringSettings'))
        currentStep.value = progressSteps[1];
      if (state.matches('enteringLibrary'))
        currentStep.value = progressSteps[2];
      if (state.matches('enteringFiles')) currentStep.value = progressSteps[3];
      if (state.matches('review')) currentStep.value = progressSteps[4];
      if (state.matches('submitted')) {
        // TODO: send files to file upload
      }

      if (state.event.type === 'RESTART') resetForm();
    });

    const validationSchema = {
      enteringGeneralInfo: object({
        title: string().required('Title is required'),
        sendEmail: bool().nullable(),
        label: string().required('Label is required'),
        notes: string(),
      }),
      enteringSettings: object({
        normMinReads: number()
          .typeError('Must be a valid number')
          .positive('Must be a strictly positive number')
          .required(),
        method: string().required(),
      }),
      libraryBuiltin: object({
        libraryBuiltin: string().required(),
      }),
      libraryFile: object({
        libraryFile: string().required('Library file is required'),
      }),
      fileCounts: object({
        fileCounts: string().required('sgRNA Counts file is required'),
        nControls: number()
          .typeError('Must be a valid number')
          .positive('Must be a strictly positive number')
          .required(),
      }),
      filesFASTQ: object({
        filesFASTQcontrols: array()
          .min(1, 'You must specify at least 1 file')
          .required(),
        filesFASTQsamples: array()
          .min(1, 'You must specify at least 1 file')
          .required(),
      }),
      filesBAM: object({
        filesBAMcontrols: array()
          .min(1, 'You must specify at least 1 file')
          .required(),
        filesBAMsamples: array()
          .min(1, 'You must specify at least 1 file')
          .required(),
      }),
    };

    const currentSchema = computed(() => {
      if (state.value.hasTag('libraryBuiltin')) {
        return validationSchema.libraryBuiltin;
      }
      if (state.value.hasTag('libraryFile')) {
        return validationSchema.libraryFile;
      }
      if (state.value.hasTag('fileCounts')) {
        return validationSchema.fileCounts;
      }
      if (state.value.hasTag('filesFASTQ')) {
        return validationSchema.filesFASTQ;
      }
      if (state.value.hasTag('filesBAM')) {
        return validationSchema.filesBAM;
      }
      return validationSchema[state.value.value];
    });

    const methodOptions = [
      {
        label: 'Scaling By Total Numbers Of Reads',
        value: 'ScalingByTotalReads',
      },
      {
        label: 'Median Ratios',
        value: 'MedRatios',
      },
    ];

    const initialValues = {
      title: '',
      label: '',
      sendEmail: true,
      normMinReads: 30,
      method: methodOptions[0]['value'],
      libraryBuiltin: libraryBuiltinOptions[0]['value'],
      libraryFile: '',
      fileCounts: '',
      nControls: 1,
      filesFASTQcontrols: [],
      filesFASTQsamples: [],
      filesBAMcontrols: [],
      filesBAMsamples: [],
    };

    const { values, handleSubmit, resetForm } = useForm({
      // vee-validate will be aware of computed schema changes
      validationSchema: currentSchema,
      // turn this on so each step values won't get removed when you move back or to the next step
      keepValuesOnUnmount: true,
      initialValues,
    });

    function goToPrev() {
      send('PREVIOUS');
    }

    const onSubmit = handleSubmit(() => {
      if (state.value.matches('enteringFiles')) {
        send('SUBMIT', {
          payload: {
            formData: values,
            formFiles: collectAllFiles({
              filesFASTQcontrolsModel: filesFASTQcontrolsModel.value,
              filesFASTQsamplesModel: filesFASTQsamplesModel.value,
              filesBAMcontrolsModel: filesBAMcontrolsModel.value,
              filesBAMsamplesModel: filesBAMsamplesModel.value,
              libraryFileModel: libraryFileModel.value,
              fileCountsModel: fileCountsModel.value,
            }),
          },
        });
      } else send('SUBMIT');
    });

    return {
      state,
      send,
      goToPrev,
      onSubmit,
      onRadioChange,
      progressSteps,
      currentStep,
      validationSchema,
      currentSchema,
      methodOptions,
      libraryBuiltinOptions,
      library,
      libraryOptions,
      libraryFileModel,
      initialValues,
      fileTypeOptions,
      fileType,
      fileCountsModel,
      filesFASTQsamplesModel,
      filesFASTQcontrolsModel,
      filesBAMsamplesModel,
      filesBAMcontrolsModel,
      values,
    };
  },
};
</script>

<style lang="postcss" scoped>
.formgroup,
.formgroup-inline,
.formgroup-multiple-inline {
  margin-bottom: var(--size-3);
}
.formgroup {
  display: grid;
  row-gap: 0.2rem;
}

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
