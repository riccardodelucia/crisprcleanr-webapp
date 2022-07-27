<template>
    <div class="test-container">
        <div class="test">
            <BaseInput label="Label" error="error">
            </BaseInput>
            <BaseSelect label="Label" error="error" :options="[{
                a: 1, label: 'a'
            }, { c: 3, label: 'c' }, {
                e: 5,
                label: 'e'
            }]" v-model="selectValue"></BaseSelect>
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
            selectValue: null
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