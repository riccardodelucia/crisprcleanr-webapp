<template>
    <div class="test-container">
        <div class="test">
            <BaseInput label="Label" error="error">
            </BaseInput>
            <BaseSelect label="Label" error="error" :options="selectOptions" v-model="selectValue"
                :optionsLabels="selectOptionLabels"></BaseSelect>
            <BaseTextarea label="Label" error="error"></BaseTextarea>
            <BaseInputFile label="Label" v-model="fileValue" error="error"></BaseInputFile>
            <BaseRadioGroup label="Label" :options="radioOptions" v-model="radioValue">
            </BaseRadioGroup>
            <BaseCheckbox v-model="checkboxValue" label="Label" option="Check me!"></BaseCheckbox>
            <BaseToggleSwitch label="Label" v-model="toggleValue" option="Toggle me!"></BaseToggleSwitch>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        const option1 = { name: "Name1", surname: "Surname1" };
        const option2 = { name: "Name2", surname: "Surname2" };
        const selectOptions = [option1, option2];
        const selectOptionLabels = { "Option 1": option1, "Option 2": option2 };
        return {
            selectOptions,
            selectOptionLabels,
            selectValue: null,
            radioOptions: ["Yes", "No", "Undecided"],
            radioValue: "Yes",
            fileValue: null,
            checkboxValue: false,
            toggleValue: false
        };
    },
}
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