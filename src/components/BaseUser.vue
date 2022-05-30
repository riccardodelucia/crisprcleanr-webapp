<template>
  <div tabindex="-1" class="user" v-click-outside="onClickOutside">
    <div v-if="!useIcon" class="user__name" @click="open = !open">
      {{ user }}
      <div class="user__arrow"></div>
    </div>
    <BaseIcon v-else name="user" @click="open = !open"></BaseIcon>
    <div v-show="open" class="user__menu">
      <a href="#" @click="logout">logout</a>
    </div>
  </div>
</template>

<script>
import { ref, computed, inject } from "vue";
import { useStore } from "vuex";
import { resizeListener } from "@/composables/utilities.js";

export default {
  name: "BaseUser",
  setup() {
    const store = useStore();
    const keycloak = inject("keycloak");
    const open = ref(false);
    const logoutRedirectUri = `${window.location.protocol}//${window.location.host}/`;
    const useIcon = ref(false);

    resizeListener(() => (useIcon.value = window.innerWidth < 500));

    const onClickOutside = () => {
      open.value = false;
    };
    const logout = () => {
      keycloak.logout({ redirectUri: logoutRedirectUri });
    };

    const user = computed(() => {
      const maxLength = 20;
      const name =
        store.state.user.user?.firstName ||
        store.state.user.user?.username ||
        "user";

      return name.length > maxLength
        ? name.substring(0, maxLength - 3).concat("...")
        : name;
    });

    return {
      open,
      logoutRedirectUri,
      useIcon,
      onClickOutside,
      logout,
      user,
    };
  },
};
</script>

<style lang="scss">
.user {
  position: relative;
  cursor: pointer;
  user-select: none;

  &__name {
    padding: 0.4em 0.8em;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.3em;

    .user__arrow {
      width: 0;
      height: 0;
      border: 5px solid transparent;
      border-color: var(--color-text-dark-blue) transparent transparent transparent;
    }
  }

  &__menu {
    position: absolute;
    font-weight: normal;
    border: 1px solid var(--color-text-dark-blue);
    //left: 0px;
    right: 0px;
    //height: 4rem;
    background-color: #fff;
    padding: 0.4em 0.8em;

    a {
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    a:link,
    a:visited {
      color: inherit;
    }
  }
}
</style>
