<template>
  <span class="ourCode">In our code 😱</span>
</template>

<style>
.ourCode {
  position: absolute;
  right: 1rem;
  top: 1rem;
  padding: 0.2rem;
  border-radius: 0.2rem;
  font-size: 1rem;
  background: var(--docto-yellow);
  animation: 1s infinite alternate pulse;
  color: white;
  font-family: var(--docto-font-titles);
  font-weight: var(--docto-font-titles-weight);
}

@keyframes pulse {
  from {
    transform: rotate(10deg) scale(1);
    opacity: 0.5;
  }
  
  to {
    transform: rotate(10deg) scale(1.1);
    opacity: 1;
  }
}
</style>
