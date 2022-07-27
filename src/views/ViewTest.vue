<template>
    <div class="test-container">
        <div class="test">
            <BaseInput label="Label" error="error">
            </BaseInput>
            <BaseSelect label="Label" error="error" :options="['a', 'b', 'c']" v-model="selectValue"></BaseSelect>
            <BaseTextarea label="Label" error="error"></BaseTextarea>
            <BaseInputFile label="Label" v-model="fileValue" error="error"></BaseInputFile>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            fileValue: null,
            selectValue: "a"
        }
    }
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
    height: 500px;
    background-color: rgb(255, 237, 99);
}
</style>