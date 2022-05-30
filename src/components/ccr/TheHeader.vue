<template>
    <BaseHeader>
        <template v-slot:logo><a href="https://humantechnopole.it/en/research-groups/iorio-group/" target="_blank"
                class="header__logo-link"><img src="@/assets/logos/iorio-white.svg" alt="Iorio logo"
                    class="header__logo logo-iorio" /></a></template>
        <template v-slot:nav>
            <router-link class="header__link" to="/dashboard">
                <BaseIcon name="grid" />
            </router-link>
            <a v-if="!keycloak.authenticated" to="#" class="header__link" @click="login">Sign in or Register</a>
            <BaseUser v-else></BaseUser>
        </template>
    </BaseHeader>
</template>

<script>

export default {
    name: "TheHeader",
    props: {
        sidenavObject: {
            type: Object
        }
    },
    inject: ["keycloak"],
    data() {
        return {
            currentUri: `${window.location.protocol}//${window.location.host}${this.$route.fullPath}`,
        };
    },
    methods: {
        login() {
            this.keycloak.login({ redirectUri: this.currentUri });
        },
    },
}
</script>

<style lang="scss" scoped>
.logo-iorio {
    height: 5.5rem;
}
</style>