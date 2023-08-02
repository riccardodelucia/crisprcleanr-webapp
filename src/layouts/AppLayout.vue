<template>
  <ht-layout-app :sidenav-object="sidenavObject">
    <template #header>
      <ul class="ht-reset ht-flex">
        <li>
          <ht-theme-switcher></ht-theme-switcher>
        </li>
        <li><ht-user></ht-user></li>
      </ul>
    </template>
    <slot></slot>
  </ht-layout-app>
</template>

<script>
export default {
  name: 'AppLayout',

  setup() {
    const sidenavObject = {
      title: 'CRISPRcleanR',
      links: [
        { id: 1, name: 'home', label: 'Home', type: 'home', url: "/home" },
        {
          id: 2,
          name: 'submit',
          label: 'Submit New Job',
          type: 'upload',
          url: "/submit"
        },
        {
          id: 3,
          name: 'resultsList',
          label: 'Results',
          type: 'eye',
          url: "/jobs"
        },
      ],
    };

    return {
      sidenavObject,
    };
  },
};
</script>

<style lang="postcss">
.app-content {
  padding: var(--size-4);
  overflow-x: scroll;
}

#main {
  overflow-x: scroll;
}
</style>
