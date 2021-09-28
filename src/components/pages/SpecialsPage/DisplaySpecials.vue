<template>
  <div class="specials-column">
    <ul>
      <base-special
      v-for='special in sortedSpecials'
      :key='special.id'
      :id='special.id'
      :title='special.title'
      :locations='special.locations'
      :description='special.description'
      :storeLocation='storeLocation'
      :reoccuringWeekend='special.reoccuringWeekend'
      :start='special.start'
      :end='special.end'
      :endNumber='special.endNumber'
      :editMode='editMode'
      :editSpecialValues='editSpecialValues'
      @delete-special="deleteSpecial"
      @edit-special="editSpecial"
      ></base-special>
    </ul>
  </div>
</template>

<script>
import BaseSpecial from './BaseSpecial.vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    BaseSpecial
  },
  props: ['editMode','editSpecialValues','sortBy','asc'],
  emits: ['fetch-specials','edit-special','delete-special'],
  data() {
    return {
      isLoading: false,
      error: null,
    }
  },
  computed: {
    ...mapGetters(['pageCategory','storeLocation','specials']),
    sortedSpecials() {
      let sortedSpecials = this.specials;
      let prop
      if (this.sortBy === 'created') { prop = 'id' }
      else if (this.sortBy === 'from') { prop = 'startNumber' }
      else if (this.sortBy === 'until') { prop = 'endNumber' }
      else { return 'oops' }
      sortedSpecials = sortedSpecials.sort((a,b) => { return a[prop] - b[prop] })
      return this.asc ? sortedSpecials.reverse() : sortedSpecials
    },
  },
  methods: {
    fetchSpecials() { this.$emit('fetch-specials') },
    editSpecial(specialObj) { this.$emit('edit-special', specialObj) },
    deleteSpecial(id) {this.$emit('delete-special', id)},
  },
  watch: {
    storeLocation() { this.fetchSpecials() },
    pageCategory() { this.fetchSpecials() },
  },
  mounted() { 
    this.fetchSpecials() 
  }
}
</script>

<style lang="scss" scoped>

.specials-column {
  margin: 0 20px;
  width: 40rem;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
  margin: auto;
  max-width: 40rem;
} 

@media screen and (max-width: 620px) {
  .specials-column {
    position: initial;
    margin: 0;
    width: 95vw;
  }
}

</style>
