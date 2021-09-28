<template>
  <button :type='type' :class='mode'>
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: ['type','mode']
}
</script>

<style lang="scss" scoped>
@import '_themes.scss';

button {
  background-color: var(--accent-background);
  border: 1px solid var(--accent-background);
  color: var(--primary-background);
  padding: 0.75rem 1.5rem;
  font-family: inherit;
  border-radius: 5px;
  cursor: pointer;
}

button:hover,
button:active {
  border-color: var(--accent-background);
  background-color: var(--light-accent);
}

.flat {
  color: var(--accent-background);
  background-color: transparent;
  border: none;
}

.flat:hover,
.flat:active {
  background-color: var(--light-accent);
}
</style>