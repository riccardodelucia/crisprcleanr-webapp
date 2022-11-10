<template>
  <div class="test-container">
    <div class="test">
      <BaseInput label="Label" error="error"> </BaseInput>
      <BaseSelect
        v-model="selectValue"
        label="Label"
        error="error"
        :options="selectOptions"
      >
      </BaseSelect>
      <BaseTextarea label="Label" error="error"></BaseTextarea>
      <BaseInputFile
        v-model="fileValue"
        label="Label"
        error="error"
      ></BaseInputFile>
      <BaseRadioGroup
        v-model="radioValue"
        label="Label"
        :options="radioOptions"
      >
      </BaseRadioGroup>
      <BaseCheckbox
        v-model="checkboxValue"
        label="Label"
        option="Check me!"
      ></BaseCheckbox>
      <BaseToggleSwitch
        v-model="toggleValue"
        label="Label"
        option="Toggle me!"
      ></BaseToggleSwitch>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    const option1 = {
      name: 'Name1',
      surname: 'Surname1',
      age: 23,
      sex: 'male',
    };
    const option2 = {
      name: 'Name2',
      surname: 'Surname2',
      age: 44,
      sex: 'female',
    };
    const selectOptions = [option1, option2];
    return {
      selectOptions,
      selectValue: null,
      radioOptions: ['Yes', 'No', 'Undecided'],
      radioValue: 'Yes',
      fileValue: null,
      checkboxValue: false,
      toggleValue: false,
    };
  },
};
</script>

<style lang="scss" scoped>
.test-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.test {
  width: 500px;
  background-color: rgb(255, 237, 99);
}
</style>
