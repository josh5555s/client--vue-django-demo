<template>
  <li class="card">
    <base-card :class="[(editMode && id === editSpecialValues.id) ? 'edit-light' : '']">
      <header>
        <h3>{{ title }}</h3> 
        <ul>
          <li v-for="location in locations" :key="location" class="locations">{{ location }}</li>
        </ul>
        <span>
          <base-button mode='flat' @click="editSpecial(id)">Edit</base-button>
          <base-button mode='flat' @click="deleteSpecial(id)">Delete</base-button>
        </span>
      </header>
      <p>{{ description }}</p>
      <div v-if="everyDay" class="timing">
        <h4>Every Day</h4>
      </div>
      <div v-else-if="timingSelection === 'reoccuring'" class="timing">
        <h4>Every {{ reoccuringWeekend }} (upcoming below)</h4>
      </div>
      <div v-if="timingSelection !== 'every-day'" class="timing">
        <span>
          <label for="datetime-start">From</label>
          <input type="datetime-local" :value="domStringStart" disabled>
        </span>
        <span>
          <label for="datetime-start">Until</label>
          <input type="datetime-local" :value="domStringEnd" disabled>
        </span>
      </div>
    </base-card>
  </li>
</template>

<script>
export default {
  props: ['id','title','description','locations','storeLocation','start','end','reoccuringWeekend','endNumber','editMode','editSpecialValues'],
  emits: ['delete-special','edit-special'],
  computed: {
    isoStart(){return new Date(this.start.getTime() - (this.start.getTimezoneOffset() * 60000)).toISOString()},
    domStringStart() {return this.isoStart.substring(0, this.isoStart.length - 5)},
    isoEnd(){return new Date(this.end.getTime() - (this.end.getTimezoneOffset() * 60000)).toISOString()},
    domStringEnd() {return this.isoEnd.substring(0, this.isoEnd.length - 5)},
    everyDay() {return this.endNumber > 30000000000000},
    timingSelection() {
      if (this.everyDay) {return 'every-day'}
      else if (!this.everyDay && this.reoccuringWeekend !== '') {return 'reoccuring'}
      else {return 'window'}
    }
  },
  methods: {
    editSpecial() {
      const specialObj = {
        id: this.id,
        title: this.title,
        description: this.description,
        locations: this.locations,
        storeLocation: this.storeLocation,
        start: this.start,
        end: this.end,
        timingSelection: this.timingSelection,
        reoccuringWeekend: this.reoccuringWeekend,
      }
      this.$emit('edit-special', specialObj)
    },
    deleteSpecial() {
      this.$emit('delete-special', this.id)
    }
  }
}
</script>

<style lang="scss" scoped>

li.card {
  margin: auto;
  max-width: 40rem;
}

li.locations {
  /* background-color: aqua; */
  font-size: 11px;
  font-style: italic;
  margin: 0 2px;
  list-style-type: none;
}

ul {
  display: flex;
  flex-direction: row;
  margin: 0;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

label {
  margin: 0 4px;
  font-size: small;
}

h3 {
  font-size: 1.25rem;
  margin: 0.5rem 0;
}

p {
  margin: 0.5rem 0;
}

a {
  text-decoration: none;
  color: #ce5c00;
}

a:hover,
a:active {
  color: #c89300;
}

@media screen and (max-width: 620px) {
  header {
    flex-direction: column-reverse;
    
  }

  header ul {
    padding: 0;
  }  

  span label {
    display: inline-block;
    width: 32px;
  }

  .timing {
    display: flex;
    flex-direction: column;
  }
}

</style>