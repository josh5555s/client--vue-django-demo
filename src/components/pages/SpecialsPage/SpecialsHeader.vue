<template>
  <header>
    <!-- <router-link to="strains"> -->
      <img id="logo" src="../../../assets/logo.png">
    <!-- </router-link> -->
    <h1>
      {{ storeLocation !== 'all' ? storeLocation : '' }} <span class='thin'> {{ pageCategory }} Specials </span>
    </h1>
    <form>
      <select id="location-selector" name="location-selector" v-bind:value="storeLocation" @change="changeStoreLocation">
        <option value="all">All Locations</option>
        <option value="Newberg">Newberg</option>
        <option value="Cedar Mill">Cedar Mill</option>
        <option value="Hillsboro">Hillsboro</option>
        <option value="Sherwood">Sherwood</option>
      </select>
      <select id="page-category" name="page-category" v-bind:value="pageCategory" @change="changePageCategory">
        <option value="Current">Current Specials</option>
        <option value="Upcoming">Upcoming Specials</option>
        <option value="Past">Past Specials</option>
      </select>
    </form>
  </header>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: { ...mapGetters(['pageCategory','storeLocation']) },
  methods: {
    changePageCategory(e) { 
      this.$store.dispatch({
        type: 'changePageCategory',
        value: e.target.value,
      }) 
    },
    changeStoreLocation(e) { 
      this.$store.dispatch({
        type: 'changeStoreLocation',
        value: e.target.value,
      })
    }
  }
}
</script>

<style lang="scss" scoped>

@import "src/components/UI/_themes.scss";

header {
  position: sticky;
  top: 0px;
  width: 100%;
  height: 5rem;
  background-color: var(--accent-background);
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.26);
}

header h1 {
  color: white;
  margin: 0 10px;
}

a {
  text-decoration: none;
}

.thin{
  font-weight: 100;
}

#logo {
  width: 60px;
}

@media screen and (max-width: 910px) {
  header {
    height: 4rem;
  }

  header h1 {
    display: none;
  }
  
  img {
    margin-left: 3px;
  }
  select {
    margin: 3px;
  }
}

</style>