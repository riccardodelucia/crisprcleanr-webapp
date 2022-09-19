import { createMachine } from "xstate";
import { useMachine } from "@xstate/vue";
import { assign } from "xstate";
import { string, number, mixed, array, bool } from "yup";
import { useField } from "vee-validate";
import CcrAPI from "@/api/ccr.js";
import store from "@/store";

////////////////////////////////////////////////
// MACHINE
const submitJobMachine = createMachine({
  id: "submitJob",
  initial: "enteringGeneralInfo",
  states: {
    enteringGeneralInfo: {
      id: "enteringGeneralInfo",
      initial: "idle",
      states: {
        idle: {
          entry: ["setupGeneralInfoSchema"],
          on: {
            NEXT: {
              target: "validating",
            },
          },
        },
        validating: {
          invoke: {
            src: "validateSchema",
            onDone: [
              {
                target: "complete",
              },
            ],
            onError: [
              {
                target: "idle",
              },
            ],
          },
        },
        complete: {
          type: "final",
        },
      },
      onDone: {
        target: "enteringSettings",
      },
    },
    enteringSettings: {
      initial: "idle",
      id: "enteringSettings",
      states: {
        idle: {
          entry: ["setupSettingsSchema"],
          on: {
            PREVIOUS: {
              target: "#enteringGeneralInfo",
            },
            NEXT: {
              target: "validating",
            },
          },
        },
        validating: {
          invoke: {
            src: "validateSchema",
            onDone: [
              {
                target: "complete",
              },
            ],
            onError: [
              {
                target: "idle",
              },
            ],
          },
        },
        complete: {
          type: "final",
        },
      },
      onDone: {
        target: "enteringLibrary.idle.hist",
      },
    },
    enteringLibrary: {
      initial: "idle",
      id: "enteringLibrary",
      states: {
        idle: {
          initial: "libraryBuiltin",
          states: {
            libraryBuiltin: {
              tags: ["libraryBuiltin"],
              entry: ["setuplibraryBuiltinSchema", "updateExcludedFieldsList"],
              on: {
                "LIBRARY.FILE": { target: "libraryFile" },
              },
            },
            libraryFile: {
              tags: ["libraryFile"],
              entry: ["setupLibraryFileSchema", "updateExcludedFieldsList"],
              on: {
                "LIBRARY.BUILTIN": { target: "libraryBuiltin" },
              },
            },
            hist: {
              type: "history",
            },
          },
          on: {
            PREVIOUS: {
              target: "#enteringSettings",
            },
            NEXT: { target: "validating" },
          },
        },
        validating: {
          invoke: {
            src: "validateSchema",
            onDone: [
              {
                target: "complete",
              },
            ],
            onError: [
              {
                target: "idle.hist",
              },
            ],
          },
        },
        complete: {
          type: "final",
        },
      },
      onDone: {
        target: "enteringFiles.idle.hist",
      },
    },
    enteringFiles: {
      initial: "idle",
      id: "enteringFiles",
      states: {
        idle: {
          initial: "fileCounts",
          states: {
            fileCounts: {
              tags: ["fileCounts"],
              entry: ["setupFileCountsSchema", "updateExcludedFieldsList"],
              on: {
                "FILE.FASTQ": { target: "filesFASTQ" },
                "FILE.BAM": { target: "filesBAM" },
              },
            },
            filesFASTQ: {
              tags: ["filesFASTQ"],
              entry: ["setupFilesFASTQschema", "updateExcludedFieldsList"],
              on: {
                "FILE.COUNTS": { target: "fileCounts" },
                "FILE.BAM": { target: "filesBAM" },
              },
            },
            filesBAM: {
              tags: ["filesBAM"],
              entry: ["setupFilesBAMschema", "updateExcludedFieldsList"],
              on: {
                "FILE.COUNTS": { target: "fileCounts" },
                "FILE.FASTQ": { target: "filesFASTQ" },
              },
            },
            hist: {
              type: "history",
            },
          },
          on: {
            PREVIOUS: {
              target: "#enteringLibrary.idle.hist",
            },
            NEXT: { target: "validating" },
          },
        },
        validating: {
          invoke: {
            src: "validateSchema",
            onDone: [
              {
                target: "complete",
              },
            ],
            onError: [
              {
                target: "idle.hist",
              },
            ],
          },
        },
        complete: {
          type: "final",
        },
      },
      onDone: {
        target: "review",
      },
    },
    review: {
      entry: ["compileFormData"],
      initial: "idle",
      states: {
        idle: {
          on: {
            PREVIOUS: {
              target: "#enteringFiles.idle.hist",
            },
            NEXT: { target: "submitting" },
          },
        },
        submitting: {
          tags: ["submitting"],
          invoke: {
            src: "submitJob",
            onDone: {
              actions: ["sendSuccessNotification", "makeUploadFilesList"],
              target: "complete",
            },
            onError: {
              actions: ["sendErrorNotification"],
              target: "complete",
            },
          },
        },
        complete: {
          type: "final",
        },
      },
      onDone: {
        target: "submitted",
        actions: ["startUploads"],
      },
    },
    submitted: {
      type: "final",
    },
  },
  on: {
    INPUT: {
      actions: "setFormFieldValue",
    },
    CHANGE: {
      actions: "setFormFieldValue",
    },
  },
});

////////////////////////////////////////////////
// UTILITIES

export function getDataFieldValue(state, field) {
  return state.context.dataFields[field].value.value;
}

export function getDataFieldErrorMessage(state, field) {
  return state.context.dataFields[field].errorMessage.value;
}

export function getFileFieldValue(state, field) {
  return state.context.fileFields[field].value.value;
}

export function getFileFieldErrorMessage(state, field) {
  return state.context.fileFields[field].errorMessage.value;
}

function getFieldValue(context, field) {
  if (context.dataFields.hasOwnProperty(field))
    return context.dataFields[field];
  if (context.fileFields.hasOwnProperty(field))
    return context.fileFields[field];
}

////////////////////////////////////////////////
// ACTIONS

const setupGeneralInfoSchema = assign({
  currentSchema: () => {
    return ["title", "sendEmail", "label", "notes"];
  },
});

const setupSettingsSchema = assign({
  currentSchema: () => ["normMinReads", "method"],
});

const setuplibraryBuiltinSchema = assign({
  currentSchema: () => ["libraryBuiltin"],
});

const setupLibraryFileSchema = assign({
  currentSchema: () => ["libraryFile"],
});

const setupFileCountsSchema = assign({
  currentSchema: () => ["fileCounts", "nControls"],
});

const setupFilesFASTQschema = assign({
  currentSchema: () => ["filesFASTQcontrols", "filesFASTQsamples"],
});

const setupFilesBAMschema = assign({
  currentSchema: () => ["filesBAMcontrols", "filesBAMsamples"],
});

const setFormFieldValue = (context, { field, payload }) => {
  const { handleChange } = getFieldValue(context, field);
  handleChange(payload);
};

const updateExcludedFieldsList = (context, event, { state }) => {
  const { excludedFields } = context;

  if (state.hasTag("libraryBuiltin")) {
    excludedFields.delete("libraryBuiltin");
    excludedFields.add("libraryFile");
  }
  if (state.hasTag("libraryFile")) {
    excludedFields.delete("libraryFile");
    excludedFields.add("libraryBuiltin");
  }
  if (state.hasTag("fileCounts")) {
    excludedFields.delete("fileCounts");
    excludedFields.delete("nControls");
    excludedFields.add("filesFASTQcontrols");
    excludedFields.add("filesFASTQsamples");
    excludedFields.add("filesBAMcontrols");
    excludedFields.add("filesBAMsamples");
  }
  if (state.hasTag("filesFASTQ")) {
    excludedFields.delete("filesFASTQcontrols");
    excludedFields.delete("filesFASTQsamples");
    excludedFields.add("fileCounts");
    excludedFields.add("filesBAMcontrols");
    excludedFields.add("filesBAMsamples");
    excludedFields.add("nControls");
  }
  if (state.hasTag("filesBAM")) {
    excludedFields.delete("filesBAMcontrols");
    excludedFields.delete("filesBAMsamples");
    excludedFields.add("fileCounts");
    excludedFields.add("filesFASTQcontrols");
    excludedFields.add("filesFASTQsamples");
    excludedFields.add("nControls");
  }
};

const compileFormData = assign((context, event) => {
  const { excludedFields } = context;
  const formData = {};

  // add fields to form data
  Object.entries(context.dataFields).forEach(([key, value]) => {
    !excludedFields.has(key) && (formData[key] = value.value.value);
  });

  Object.entries(context.fileFields).forEach(([key, value]) => {
    if (!excludedFields.has(key)) {
      const fileField = value.value.value;
      if (Array.isArray(fileField)) {
        formData[key] = fileField.map((file) => file.name);
      } else formData[key] = fileField.name;
    }
  });

  return { formData };
});

const sendErrorNotification = (_, event) => {
  store.dispatch("notification/add", {
    type: "error",
    title: "Submission Error",
    message: event.data.message,
  });
};

const sendSuccessNotification = (
  _,
  {
    data: {
      data: { jobId },
    },
  }
) => {
  store.dispatch("notification/add", {
    type: "success",
    title: "Job Submitted",
    message: `Job ID: ${jobId}`,
  });
};

const makeUploadFilesList = assign(
  (
    { fileFields },
    {
      data: {
        data: { filesList },
      },
    }
  ) => {
    const candidates = Object.values(fileFields).reduce((acc, field) => {
      const {
        value: { value },
      } = field;
      if (value)
        if (Array.isArray(value))
          value.forEach((file) => (acc[file.name] = file));
        else acc[value.name] = value;
      return acc;
    }, {});

    const uploads = filesList.map((file) => ({
      ...file,
      file: candidates[file.filename],
    }));

    return {
      uploads,
    };
  }
);

const startUploads = ({ uploads }, _) => {
  uploads.forEach((upload) => {
    store.dispatch("uploads/add", upload);
  });
};

////////////////////////////////////////////////
// SERVICES
const validateSchema = (context) => {
  const { currentSchema: schema } = context;

  // here I assume validations are always found inside getField method
  const validations = schema.map((field) =>
    getFieldValue(context, field).validate()
  );
  return new Promise((resolve, reject) =>
    Promise.all(validations).then((values) => {
      const validArray = values.map((item) => item.valid);
      if (validArray.includes(false)) reject();
      else resolve();
    })
  );
};

const submitJob = (context) => CcrAPI.submitJob(context.formData);

////////////////////////////////////////////////
// FACTORY
export const getInterpretedMachine = () => {
  const dataFields = {};
  const fileFields = {};

  // step 1
  dataFields["title"] = useField(
    "title",
    string().required("title is required")
  );
  dataFields["sendEmail"] = useField("sendEmail", bool(), {
    initialValue: true,
  });
  dataFields["label"] = useField(
    "label",
    string().required("label is required")
  );
  dataFields["notes"] = useField("notes", string());

  // step 2
  dataFields["normMinReads"] = useField(
    "normMinReads",
    number().positive().required(),
    { initialValue: 30 }
  );
  dataFields["method"] = useField("method", string().required());

  // step 3 version A
  dataFields["libraryBuiltin"] = useField(
    "libraryBuiltin",
    string().required()
  );

  // step 3 version B
  fileFields["libraryFile"] = useField("libraryFile", mixed().required());

  // step 4 verison A
  fileFields["fileCounts"] = useField("fileCounts", string().required());
  dataFields["nControls"] = useField(
    "nControls",
    number().positive().required(),
    { initialValue: 1 }
  );

  // step 4 verison B
  fileFields["filesFASTQcontrols"] = useField(
    "filesFASTQcontrols",
    array().required()
  );

  fileFields["filesFASTQsamples"] = useField(
    "filesFASTQsamples",
    array().required()
  );

  // step 4 verison C
  fileFields["filesBAMcontrols"] = useField(
    "filesBAMcontrols",
    array().required()
  );

  fileFields["filesBAMsamples"] = useField(
    "filesBAMsamples",
    array().required()
  );

  return useMachine(submitJobMachine, {
    context: {
      dataFields,
      fileFields,
      formData: {},
      currentSchema: [],
      excludedFields: new Set(["excludedFields", "currentSchema", "formData"]),
      uploads: [],
    },
    actions: {
      updateExcludedFieldsList,
      setFormFieldValue,
      setupGeneralInfoSchema,
      setupSettingsSchema,
      setuplibraryBuiltinSchema,
      setupLibraryFileSchema,
      setupFileCountsSchema,
      setupFilesFASTQschema,
      setupFilesBAMschema,
      compileFormData,
      sendErrorNotification,
      sendSuccessNotification,
      makeUploadFilesList,
      startUploads,
    },
    services: {
      validateSchema,
      submitJob,
    },
  });
};
