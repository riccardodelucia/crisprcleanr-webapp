<template>
    <div class="input-field">
        <label class="input-field__label" v-if="label">{{ label }}</label>
        <div class="radio-group">
            <label v-for="option in options" :key="option" class="radio-group__element">
                <div class="radio-group__input" :class="{ 'radio-group__input--selected': option === modelValue }">
                </div>
                <input hidden type="radio" :value="option" :id="option" @click="emit('update:modelValue', option)" />
                {{ option }}
            </label>
        </div>
    </div>
</template>

<script>

export default {
    name: "BaseRadionButtonGroup",
    props: {
        label: {
            type: String,
            default: "",
        },
        options: {
            required: true,
            type: Array,
        },
        modelValue: {
            type: String // TODO make component compatible with any other type, like VueBaseSelect
        }
    },
    setup(_, { emit }) {
        return {
            emit
        }
    }
};
</script>

<style lang="scss" scoped>
</style>