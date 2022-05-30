<template>
  <form class="card job-form" ref="form" @submit="submit">
    <div class="form__group">
      <BaseInput label="Title" v-model.trim="title" type="text" placeholder="Your title here" :error="errors.title">
      </BaseInput>
    </div>
    <div class="form__group">
      <BaseInput label="Email (optional)" :modelValue="email" @change="emailChange" type="email"
        placeholder="Your email here" :error="errors.email">
      </BaseInput>
    </div>
    <div class="form__group">
      <BaseInput label="Data label" v-model="label" type="text" placeholder="Your data label here"
        :error="errors.label">
      </BaseInput>
    </div>

    <div class="form__group">
      <BaseSelect label="Library" :options="Object.keys(config.libraries)" v-model="library" :error="errors.library">
      </BaseSelect>
    </div>

    <div class="form__group">
      <BaseInput label="Minimal number of reads in the control sample" v-model.number="normMinReads" type="number"
        :error="errors.normMinReads">
      </BaseInput>
    </div>
    <div class="form__group">
      <BaseInput label="Number of controls" v-model.number="nControls" type="number" :error="errors.nControls">
      </BaseInput>
    </div>
    <div class="form__group">
      <BaseSelect label="Normalization Method" :options="Object.keys(methods)" v-model="method" :error="errors.method">
      </BaseSelect>
    </div>
    <div class="form__group">
      <BaseTextarea label="Notes" v-model="notes" placeholder="Your notes here" />
    </div>
    <div class="form__group">
      <BaseInputFile class="button button--secondary button--large" label="File" v-model="fileCounts"
        :error="errors.fileCounts">
      </BaseInputFile>
    </div>

    <button class="button button--primary button--large submit-button">
      Submit
    </button>
  </form>
</template>

<script>
import { computed } from "vue";
import { useField, useForm } from "vee-validate";
import { object, string, number, mixed } from "yup";
import { useRouter } from "vue-router";

export default {
  name: "FormFill",
  props: {
    config: { type: Object },
  },
  setup(props, { emit }) {
    const router = useRouter();

    const validationSchema = object({
      title: string().required(),
      email: string().email().nullable(),
      label: string().required(),
      library: string().required(),
      normMinReads: number().required(),
      nControls: number().required(),
      fileCounts: mixed().required(),
      method: string().required(),
      notes: string(),
    });
    const { handleSubmit, errors } = useForm({
      validationSchema,
      initialValues: {
        normMinReads: 30,
        nControls: 1,
        email: null,
        notes: "",
      },
    });

    const { value: title } = useField("title");
    const { value: email, handleChange: emailChange } = useField("email");
    const { value: label } = useField("label");
    const { value: library } = useField("library");
    const { value: normMinReads } = useField("normMinReads");
    const { value: nControls } = useField("nControls");
    const { value: fileCounts } = useField("fileCounts");
    const { value: method } = useField("method");
    const { value: notes } = useField("notes");

    const buildResultsUrl = () => {
      const routePath = router
        .getRoutes()
        .find((item) => item.name === "resultsId").path;
      const staticPath = routePath.includes("/:")
        ? routePath.split(":")[0]
        : routePath;
      const origin = window.location.origin;
      return origin.concat(staticPath);
    };

    const submit = handleSubmit(() => {
      emit("nav", {
        event: "SUBMIT",
        payload: {
          title: title.value,
          email: email.value,
          label: label.value,
          library: props.config.libraries[library.value],
          normMinReads: normMinReads.value,
          nControls: nControls.value,
          method: method.value,
          fileCounts: fileCounts.value,
          notes: notes.value,
          resultsUrl: buildResultsUrl(),
        },
      });
    });

    const methods = computed(() =>
      props.config?.methods.reduce((acc, item) => {
        acc[item.label] = item.value;
        return acc;
      }, {})
    );

    return {
      title,
      email,
      emailChange,
      label,
      library,
      normMinReads,
      nControls,
      fileCounts,
      method,
      methods,
      notes,
      submit,
      errors,
    };
  },
};
</script>

<style lang="scss" scoped>
.submit-button {
  width: 100%;
}

.job-form {
  max-width: 50rem;
  display: flex;
  flex-direction: column;
}
</style>
