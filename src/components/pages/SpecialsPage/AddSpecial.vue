<template>
  <div class="form-column">
    <base-card>
      <form @submit.prevent="">

        <div v-if="storeLocation === 'all'" class="location-selection">

          <div class="group-1 row">
            <div class="row">
              <input type="checkbox" id="select-newberg" name="Newberg" value="Newberg" v-model="locationsInput">
              <label for="select-newberg">Newberg</label>
            </div>

            <div class="row">
              <input type="checkbox" id="select-cedar-mill" name="Cedar Mill" value="Cedar Mill" v-model="locationsInput">
              <label for="select-cedar-mill">Cedar Mill</label>
            </div>
          </div>

          <div class="group-2 row">
            <div class="row">
              <input type="checkbox" id="select-hillsboro" name="Hillsboro" value="Hillsboro" v-model="locationsInput">
              <label for="select-hillsboro">Hillsboro</label>
            </div>

            <div class="row">
              <input type="checkbox" id="select-sherwood" name="Sherwood" value="Sherwood" v-model="locationsInput">
              <label for="select-sherwood">Sherwood</label>
            </div>
          </div>

        </div>

        <div class="form-control">
          <label for="title">Title</label>
          <input id="title" name="title" type="text" v-model.trim="titleInput">
        </div>
        <div class="form-control">
          <label for="description">Description</label>
          <textarea id="description" name="description" rows="3" v-model.trim="descInput"></textarea>
        </div>
        <div class="form-control timing">
          <label for="title">Timing:</label>

          <input type="radio" id="window" name="timing" value="window" v-model="timingSelection">
          <label for="window">Window</label>

          <input type="radio" id="every-day" name="timing" value="every-day" v-model="timingSelection">
          <label for="every-day">Every Day</label>
          
          <input type="radio" id="reoccuring" name="timing" value="reoccuring" v-model="timingSelection">
          <label for="reoccuring">Reoccuring Weekend</label>
        </div>

        <div v-if="timingSelection === 'window'" class="form-control dates">
          <div class="row">
            <label for="datetime-start">From</label>
            <input type="datetime-local" v-model="start">
          </div>
          <div class="row">
            <label for="datetime-end">Until</label>
            <input type="datetime-local" v-model="end">
          </div>
        </div>
        
        <div v-if="timingSelection === 'reoccuring'" class="form-control weekends">
          <div class="row">
            <input type="radio" id="1st-weekend" name="weekend" value="1st Weekend" v-model="reoccuringWeekend">
            <label for="1st-weekend">First </label>
          </div>
          <div class="row">
            <input type="radio" id="2nd-weekend" name="weekend" value="2nd Weekend" v-model="reoccuringWeekend">
            <label for="2nd-weekend">Second</label>
          </div>
          <div class="row">
            <input type="radio" id="3rd-weekend" name="weekend" value="3rd Weekend" v-model="reoccuringWeekend">
            <label for="3rd-weekend">Third</label>
          </div>
          <div class="row">
            <input type="radio" id="last-weekend" name="weekend" value="Last Weekend" v-model="reoccuringWeekend">
            <label for="last-weekend">Last</label>
          </div>
        </div> 

        <div class="button-container">
          <base-button v-if="editMode" @click="updateSpecial"> Update Special </base-button>
          <base-button @click="submitData">{{ editMode? 'New Special' : 'Add Special'}} </base-button>
          <base-button v-if="editMode" @click="cancelEditMode" class="inverse-button"> Cancel </base-button>
        </div>
      </form>
    </base-card>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  props: ['storeLocation','editMode','editSpecialValues'],
  emits: ['fetch-specials','delete-special','error-modal','edit-off'],
  inject: ['addSpecial'],
  data() {
    return {
      objId: '',
      titleInput: '',
      descInput: '',
      locationsInput: [],
      timingSelection: 'window', 
      start: '',
      end: '',
      reoccuringWeekend: '',
    }
  },
  computed: {
    ...mapGetters(['specialsUrl']),
    compStart() {
      return this.timingSelection === 'every-day' ? '2000-01-01T00:01' : this.start
    },
    compEnd() {
      return this.timingSelection === 'every-day' ? '3000-01-01T00:01' : this.end
    }
  },
  methods: {
    editSpecial() {
      this.objId = this.editSpecialValues.id
      this.titleInput = this.editSpecialValues.title
      this.descInput = this.editSpecialValues.description
      this.locationsInput = this.editSpecialValues.locations
      this.timingSelection = this.editSpecialValues.timingSelection
      this.reoccuringWeekend = this.editSpecialValues.reoccuringWeekend
      this.start = this.editSpecialValues.start
      this.end = this.editSpecialValues.end
    },
    clearEditSpecial() {
      this.objId = ''
      this.titleInput = ''
      this.descInput = ''
      this.locationsInput = []
      this.timingSelection = 'window'
      this.reoccuringWeekend = ''
      this.start = ''
      this.end = ''
    },
    updateSpecial() {
      this.$emit('delete-special', this.objId)
      this.submitData()
    },
    cancelEditMode(){
      this.clearEditSpecial()
      this.$emit('edit-off')
    },
    submitData() {
        if (
          this.locationsInput === [] || this.titleInput === '' || this.descInput === '' ||
          (this.timingSelection === 'window' && (this.start === '' || this.end === '')) ||
          (this.timingSelection === 'reoccuring' && (this.reoccuringWeekend === ''))
        ) {
          this.$emit('error-modal')
          return
        }
        // address the below if statements, why do they exist?
      if (this.storeLocation !== 'all') {
        this.locationsInput = [`${this.storeLocation}`]
      }
      if (this.specialsUrl === 'http://192.168.1.2:8000/specials/') {
        this.locationsInput = `${this.locationsInput}`
      }
      this.locationsInput = this.locationsInput.join(',')
      fetch(this.specialsUrl, {
        method: 'POST',
        accept: 'application/json',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify({
          title: this.titleInput,
          description: this.descInput,
          locations: this.locationsInput,
          start_date: this.compStart,
          start_time: new Date(this.compStart).getTime(),
          end_date: this.compEnd,
          end_time: new Date(this.compEnd).getTime(),
          reoccuring_weekend: this.reoccuringWeekend,
        })
      })
      .then(response => {
          this.clearEditSpecial()
          setTimeout(() => {
            this.$emit('fetch-specials')
          }, 200);
          this.$emit('edit-off')
        if (response.ok) {
          // ...
        } else {
          throw new Error('Could not save data!')
        }
      })
      .catch((error) => {
        this.error = error.message
        console.log(error)
      })

    },
    confirmError() {
      this.inputIsInvalid = false
    }
  },
  watch: {
    editMode() {
      if(this.editMode) {
        this.editSpecial()
      } else {
        this.clearEditSpecial()
      }
    },
  }
}
</script>

<style lang="scss" scoped>

.title {
  display: flex;
  justify-content: center;
}

.form-column {
  margin: 0 20px;
  width: 40rem;
}

h2 {
  margin-block: 0.2em;
}
label {
  font-weight: bold;
  display: block;
  margin-bottom: 0.5rem;
}

.location-selection {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.location-selection input {
  min-width: 12px;
}

.location-selection label {
  margin-bottom: 0;
  white-space: nowrap;
}

.location-selection .group-1,
.location-selection .group-2 {
  display: flex;
  width: 50%;
  justify-content: space-around;
}

.row {
  display: flex;
  /* min-width: 80px; */
}

.location-selection .row {
  min-width: 0;
}


input,
textarea {
  display: block;
  width: 100%;
  font: inherit;
  padding: 0.15rem;
  border: 1px solid #ccc;
  resize: none;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: forestgreen;
  background-color: #d4ffda;
}

button {
  margin-right: 10px;
}

button:hover {
  background-color: #d4ffda; 
  color: forestgreen;
}

.form-control {
  margin: 1rem 0;
}

.dates,
.weekends {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-top: 0; 
}

.dates label {
  margin-bottom: 0;
  margin-right: 8px;
}

.timing {
  display: flex;
  flex-direction: row;
  justify-content: left;

}

.timing input {
  width: initial;
}

.weekends input {
  min-width: 12px;
  /* margin: 0 4px; */
}

.inverse-button {
  background-color: white;
  color: forestgreen;
}

.inverse-button:hover {
  background-color: #d4ffda;
}

@media screen and (max-width: 620px) {
  
  .form-column {
    margin: 0;
    width: 95vw;
  }

  .location-selection {
    flex-direction: column;
  }

  .location-selection .group-1,
  .location-selection .group-2 {
    width: 100%;
    margin-top: 8px;
  }

  .dates {
    flex-direction: column;
  }

  .dates label {
    width: 50px;
  }

  .button-container {
    display: flex;
    justify-content: center;
  }
}

</style>