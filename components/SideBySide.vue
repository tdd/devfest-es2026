<template>
  <div :class="class" style="display: flex; gap: 1rem; align-items: flex-start">
    <slot />
  </div>
</template>

<style>
.fullWidth {
  justify-content: space-between;
}

.slidev-layout div > img {
  margin: 0;
}

</style>
