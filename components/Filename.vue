<template>
  <p class="fileName"><slot/></p>
</template>

<style>
.fileName {
  font-family: "Operator Mono SSm A", "Operator Mono SSm B", "JetBrains Mono",
      ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
      "Courier New", monospace !important;
  color: silver;
  font-size: 0.6rem;
  position: relative;
  top: -1rem;
}
</style>