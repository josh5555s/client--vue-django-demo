<template>
  <base-modal title="invalid input" @close="confirmError">
    <template #default>
      <p>At least one required input value is invalid</p>
      <p>Please check all inputs and make sure to fill them out</p>
    </template>
    <template #actions>
      <base-button @click="confirmError">Okay</base-button>
    </template>
  </base-modal>
</template>

<script>
import BaseModal from '../UI/BaseModal.vue'
export default {
  components: {
    BaseModal,
  },
  methods: {
    confirmError() {
      this.$emit('confirm-error')    
    }
  }
}
</script>