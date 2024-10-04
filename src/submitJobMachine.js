import { createMachine } from 'xstate';
import { useMachine } from '@xstate/vue';
import { assign } from 'xstate';
import { addFileUpload } from '@/uploads.js';

import CcrAPI from '@/api/ccr.js';

////////////////////////////////////////////////
// MACHINE
const submitJobMachine = createMachine({
  predictableActionArguments: true,
  id: 'submitJob',
  initial: 'enteringGeneralInfo',
  context: {
    currentSchema: {
      enteringLibrary: 'libraryBuiltin',
      enteringFiles: 'fileCounts',
    },
    formData: {},
    submitData: {},
    formFiles: [],
    jobId: '',
    filesUploads: [],
    submissionErrorMessage: '',
  },
  states: {
    enteringGeneralInfo: {
      id: 'enteringGeneralInfo',
      on: {
        SUBMIT: {
          target: 'enteringSettings',
        },
      },
    },
    enteringSettings: {
      on: {
        PREVIOUS: {
          target: 'enteringGeneralInfo',
        },
        SUBMIT: {
          target: 'enteringLibrary.hist',
        },
      },
    },
    enteringLibrary: {
      initial: 'libraryBuiltin',
      states: {
        libraryBuiltin: {
          tags: ['libraryBuiltin'],
          entry: ['setCurrentSchemaLibraryBuiltin'],
          on: {
            'LIBRARY.FILE': { target: 'libraryFile' },
          },
        },
        libraryFile: {
          tags: ['libraryFile'],
          entry: ['setCurrentSchemaLibraryFile'],
          on: {
            'LIBRARY.BUILTIN': { target: 'libraryBuiltin' },
          },
        },
        hist: {
          type: 'history',
        },
      },
      on: {
        PREVIOUS: {
          target: 'enteringSettings',
        },
        SUBMIT: {
          target: 'enteringFiles.hist',
        },
      },
    },
    enteringFiles: {
      initial: 'fileCounts',
      id: 'enteringFiles',
      states: {
        fileCounts: {
          tags: ['fileCounts'],
          entry: ['setCurrentSchemaFileCounts'],
          on: {
            'FILE.FASTQ': { target: 'filesFASTQ' },
            'FILE.BAM': { target: 'filesBAM' },
          },
        },
        filesFASTQ: {
          tags: ['filesFASTQ'],
          entry: ['setCurrentSchemaFilesFASTQ'],
          on: {
            'FILE.COUNTS': { target: 'fileCounts' },
            'FILE.BAM': { target: 'filesBAM' },
          },
        },
        filesBAM: {
          tags: ['filesBAM'],
          entry: ['setCurrentSchemaFilesBAM'],
          on: {
            'FILE.COUNTS': { target: 'fileCounts' },
            'FILE.FASTQ': { target: 'filesFASTQ' },
          },
        },
        hist: {
          type: 'history',
        },
      },
      on: {
        PREVIOUS: {
          target: 'enteringLibrary.hist',
        },
        SUBMIT: {
          target: 'review',
        },
      },
    },
    review: {
      initial: 'idle',
      states: {
        idle: {
          entry: ['assignFormData', 'assignSubmitData', 'assignFormFiles'],
          on: {
            PREVIOUS: {
              target: '#enteringFiles.hist',
            },
            SUBMIT: { target: 'submitting' },
          },
        },
        submitting: {
          tags: ['submitting'],
          invoke: {
            src: 'submitJob',
            onDone: {
              actions: ['assignJobId', 'prepareFileUploads'],
              target: '#submitted',
            },
            onError: {
              actions: ['assignSubmissionErrorMessage'],
              target: 'submissionError',
            },
          },
        },
        submissionError: {
          id: 'submissionError',
          on: {
            RETRY: { target: 'submitting' },
            RESTART: { target: '#enteringGeneralInfo' },
          },
        },
      },
    },
    submitted: {
      id: 'submitted',
      on: {
        RESTART: { target: '#enteringGeneralInfo' },
      },
    },
  },
});

////////////////////////////////////////////////
// ACTIONS

const factorySetCurrentSchema = (step, schema) => {
  return assign({
    currentSchema: (context) => {
      context.currentSchema[step] = schema;
      return context.currentSchema;
    },
  });
};

const assignFormData = assign({
  formData: (context, event) => event.payload.formData,
});

const assignSubmitData = assign({
  submitData: ({ formData, currentSchema }) => {
    const submitData = {};
    submitData.title = formData.title;
    submitData.label = formData.label;
    submitData.sendEmail = formData?.sendEmail ? true : false;
    submitData.normMinReads = formData.normMinReads;
    submitData.method = formData.method;
    if (currentSchema.enteringLibrary === 'libraryBuiltin') {
      submitData.libraryBuiltin = formData.libraryBuiltin;
      submitData.nControls = formData.nControls;
    }

    if (currentSchema.enteringLibrary === 'libraryFile')
      submitData.libraryFile = formData.libraryFile;
    if (currentSchema.enteringFiles === 'fileCounts')
      submitData.fileCounts = formData.fileCounts;
    if (currentSchema.enteringFiles === 'filesFASTQ') {
      submitData.filesFASTQcontrols = formData.filesFASTQcontrols;
      submitData.filesFASTQsamples = formData.filesFASTQsamples;
    }
    if (currentSchema.enteringFiles === 'filesBAM') {
      submitData.filesBAMcontrols = formData.filesBAMcontrols;
      submitData.filesBAMsamples = formData.filesBAMsamples;
    }
    return submitData;
  },
});

const assignFormFiles = assign({
  formFiles: (context, event) => event.payload.formFiles,
});

const assignSubmissionErrorMessage = assign({
  submissionErrorMessage: (_, event) => event?.data?.message || 'Unknown Error',
});

const assignJobId = assign({
  jobId: (_, { data: { data: filesList } }) => {
    return filesList[0].jobId;
  },
});

const prepareFileUploads = (context, event) => {
  const fileObjectsList = event.data.data;
  const formFiles = context.formFiles;

  for (const fileObject of fileObjectsList) {
    let upload;
    const index = formFiles
      .map(({ name }) => name)
      .findIndex((name) => name === fileObject.filename);
    if (index >= 0)
      upload = {
        file: formFiles[index],
        fileObject,
        filename: fileObject.filename,
      };
    else
      upload = {
        errorMessage: `Error: cannot find back file ${fileObject.name}`,
        fileObject,
        filename: fileObject.filename,
      };
    addFileUpload(upload);
  }
};

////////////////////////////////////////////////
// SERVICES

const submitJob = (context) => {
  return CcrAPI.submitJob(context.submitData);
};

////////////////////////////////////////////////
// FACTORY
export const getInterpretedMachine = () => {
  // This object is used to determine which fields are active according to the user's form filling

  return useMachine(submitJobMachine, {
    actions: {
      setCurrentSchemaLibraryBuiltin: factorySetCurrentSchema(
        'enteringLibrary',
        'libraryBuiltin'
      ),
      setCurrentSchemaLibraryFile: factorySetCurrentSchema(
        'enteringLibrary',
        'libraryFile'
      ),
      setCurrentSchemaFileCounts: factorySetCurrentSchema(
        'enteringFiles',
        'fileCounts'
      ),
      setCurrentSchemaFilesFASTQ: factorySetCurrentSchema(
        'enteringFiles',
        'filesFASTQ'
      ),
      setCurrentSchemaFilesBAM: factorySetCurrentSchema(
        'enteringFiles',
        'filesBAM'
      ),
      assignFormData,
      assignSubmitData,
      assignFormFiles,
      assignJobId,
      prepareFileUploads,
      assignSubmissionErrorMessage,
    },
    services: {
      submitJob,
    },
  });
};
