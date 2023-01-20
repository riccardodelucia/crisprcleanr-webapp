<template>
  <ht-sidenav-collapsible
    :sidenav-object="sidenavObject"
  ></ht-sidenav-collapsible>
</template>
<script>
export default {
  name: 'TheSidenav',
  data() {
    return {
      sidenavObject: {
        title: 'CRISPRcleanR',
        links: [
          { id: 1, url: '/home', label: 'Home' },
          { id: 2, url: '/submit', label: 'Submit New Job' },
          { id: 3, url: '/jobs', label: 'Results' },
        ],
      },
    };
  },
};
</script>
