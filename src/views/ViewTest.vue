<template>
    <div class="test-container">
        <div class="test">
            <BaseInput label="Label" error="error">
            </BaseInput>
            <BaseSelect label="Label" error="error" :options="{ text1: 1, text2: 2 }"></BaseSelect>
            <BaseTextarea label="Label" error="error"></BaseTextarea>
            <BaseInputFile label="Label" v-model="value" error="error"></BaseInputFile>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            value: null
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