<template>

  <SpecialsHeader/>

  <error-modal
    v-if="inputIsInvalid"
    @confirm-error="toggleErrorModal"
  ></error-modal>

  <div v-if="pageCategory === 'Current' || pageCategory === 'Upcoming' || pageCategory === 'Past'" class="body-container">
    <div class="add-container">
      
      <div class="inner-add-container">

        <base-card class="title" :class="[editMode ? 'edit-light' : '']">
          <h2>{{ editMode ? 'Edit' : 'Add New'}} {{ storeLocation !== 'all' ? storeLocation : '' }} Special</h2>
        </base-card>

        <add-special 
          :storeLocation="storeLocation"
          :editMode="editMode"
          :editSpecialValues="editSpecialValues"
          @fetch-specials="fetchSpecials"
          @error-modal="toggleErrorModal"
          @edit-off="editModeOff"
          @delete-special="deleteSpecial"
        ></add-special>

      </div>

    </div>
    <div class="show-container">
      <div class="inner-show-container">
        <base-card class="title primary" id="display-title">
          <div class="row">
            <h2>{{ pageCategory }} {{ storeLocation !== 'all' ? storeLocation : '' }} Specials</h2>
            <div class="vert-center">
              <div class="row">
                <select id="sortBy" name="sortBy" v-bind:value="sortBy" @change="updateSortBy">
                  <option value="from">Sorted By "From"</option>
                  <option value="until">Sorted By "Until"</option>
                  <option value="created">Sorted By "Created"</option>
                </select>
                <button class="ascDsc" @click="ascDsc">
                  <i v-if="asc" class="fas fa-arrow-up"></i>
                  <i v-else class="fas fa-arrow-down"></i>
                </button>
              </div>
            </div>
          </div>
        </base-card>
        <display-specials 
          :editMode="editMode"
          :editSpecialValues="editSpecialValues"
          :sortBy="sortBy"
          :asc="asc"
          @fetch-specials="fetchSpecials"
          @edit-special="toggleEditMode"
          @delete-special="deleteSpecial"
        ></display-specials>
      </div>
    </div>
  </div>

</template>

<script>
import SpecialsHeader from './SpecialsHeader'
import ErrorModal from '../ErrorModal'
import DisplaySpecials from './DisplaySpecials'
import AddSpecial from './AddSpecial'
import { mapGetters } from 'vuex'

export default {
  components: {
    SpecialsHeader,
    ErrorModal,
    DisplaySpecials,
    AddSpecial
  },
  data() {
    return {
      inputIsInvalid: false,
      editMode: false,
      editSpecialValues: {},
      sortBy: 'from',
      asc: false,
    }
  },
  computed: {
    ...mapGetters(['pageCategory','storeLocation','specials','specialsUrl']),
  },
  provide() {
    return {
      addSpecial: this.addSpecial,
    }
  },
  methods: {
    submitEdits() { this.toggleEditModal()  },
    toggleErrorModal() { this.inputIsInvalid = !this.inputIsInvalid },
    toggleEditMode(specialObj) { 
      this.editMode = !this.editMode
      this.editSpecialValues = specialObj
    },
    editModeOff() { this.editMode = false },
    ascDsc() { this.asc= !this.asc},
    deleteSpecial(id) {
      fetch(`${this.specialsUrl}${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application-json'
        }
      })
      .then(response => {
        if (response.ok) {
          this.fetchSpecials()
        } else {
          throw new Error('Could not delete data!')
        }
      })
    },
    fetchSpecials() { 
      this.$store.dispatch({
        type: 'fetchSpecials'
      }) 

    },
    updateSortBy(e) {
      this.sortBy = e.target.value
    }
  },

  mounted() {
    // set page title
    document.title = 'Specials Scheduler';

    // set 'app-background' class to body tag
    let bodyElement = document.body;
    bodyElement.classList.add("app-background");

    // check for active theme
    let htmlElement = document.documentElement;
    let theme = this.$route.path;
    theme = theme.substring(1, theme.length)
    htmlElement.setAttribute('theme', theme)
  },
}
</script>

<style lang="scss" scoped>

.title {
  position: sticky;
  top: 65px;
  color: var(--primary-background);
  background-color: var(--accent-background);
  text-align: center;
}

add-special {
  position: sticky;
  top: 200px;
}

.body-container {
  display: flex;
  justify-content: center;
}

.row {
  display: flex;
  justify-content: center;
}

select {
  height: 20px;
}

label {
  margin: 0 5px;
}

.vert-center {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.ascDsc {
  background-color: var(--primary-background);
  color: var(--accent-background);
  border-radius: 5px;
}

/* move to single column*/
@media screen and (max-width: 1280px) {

  .title {
    position: initial;
    width: 95vw;
  }

  #display-title {
    margin-top: 0;
  }

  .body-container {
    flex-direction: column;
  }

  .add-container, .show-container {
    /* width: 300px; */
    display: flex;
    justify-content: center;
  }


  /* @media screen and (max-width: 800px) {
    .title {
      position: initial;
      width: 95vw;
    }

    .inner-add-container,
    .inner-show-container {
      width: 95vw;
    }
  } */
}
</style>