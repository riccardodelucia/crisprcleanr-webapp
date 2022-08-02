<template>
    <div class="form-progress">
        <div class="form-progress__bar" :style="{ width: progress }"></div>
        <div v-for="(step, index) in steps" :key="step" class="form-progress__step"
            :class="{ 'form-progress__step--active': index <= currentStepIndex }" :data-title="step">{{ index + 1 }}
        </div>
    </div>
</template>

<script>

export default {
    name: "BaseFormProgressBar",
    props: {
        currentStep: {
            type: String,
            required: true
        },
        steps: {
            type: Array,
            required: true
        }
    },
    computed: {
        progress() {
            return `${this.computeProgress(this.currentStepIndex)}%`
        },
        currentStepIndex() {
            return this.steps.indexOf(this.currentStep) || 0;
        }
    },
    methods: {
        computeProgress(index) {
            return 100 / (this.steps.length - 1) * index
        }
    }
}

</script>

<style lang="scss" scoped>
.form-progress {
    display: flex;
    justify-content: space-between;
    padding: 1em 0;
    position: relative;
    margin-bottom: 2em;
    counter-reset: step;
    color: var(--color-grey-medium);

    &:before,
    &__bar {
        content: "";
        position: absolute;
        top: 50%;
        left: 0;
        height: .5rem;
        transform: translateY(-50%);
    }

    &:before {
        background-color: var(--color-grey-lighter);
        width: 100%;
    }

    &__bar {
        background-color: var(--color-blue-lighter);
        width: 0%;
        transition: width 0.3s ease-out;
    }

    &__step {
        z-index: 2;
        width: 4rem;
        height: 4rem;
        border-radius: 50%;
        background-color: var(--color-grey-lighter);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        transition: background-color 0.2s ease-out, color 0.2s ease-out;

        &--active {
            background-color: var(--color-blue-lighter);
            color: white;
            transition-delay: 0;
        }

        &:after {
            position: absolute;
            content: attr(data-title);
            top: calc(100% + 0.3rem);
            font-size: 1.5rem;
            color: var(--color-grey-medium);
        }
    }
}
</style>