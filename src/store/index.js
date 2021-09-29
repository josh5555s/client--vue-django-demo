import { createStore } from 'vuex';
// import { mutations } from './mutations'
// import { actions } from './actions'
// import { getters } from './getters'

const store = createStore({
  state() {
    return {
      productionSpecialsApi: true,
      productionStrainsApi: false,
      pageCategory: 'Current',
      storeLocation: 'all',
      specials: [],
      authenticated: false,
    }
  },
  mutations: {
    authenticate(state) {
      state.authenticated = true
    },
    changePageCategory(state, payload) { 
      state.pageCategory = payload.value
    },
    changeStoreLocation(state, payload) {
      state.storeLocation = payload.value
    },
    filterSpecials(state, payload) {
      let results = payload
      let d = new Date()
      let currentDatetimeNumber = d.getTime()
      let filteredSpecials = []
      results.forEach(result => {
        if (state.pageCategory === 'Upcoming' && result.startNumber > currentDatetimeNumber) {
          filteredSpecials.push(result)
        } else if (state.pageCategory === 'Current' && result.startNumber < currentDatetimeNumber && result.endNumber > currentDatetimeNumber){
          filteredSpecials.push(result)
        } else if (state.pageCategory === 'Past' && result.endNumber < currentDatetimeNumber){
          filteredSpecials.push(result)
        }
      }) 
      let twiceFilteredSpecials = []
      if (state.storeLocation === 'all') { 
        filteredSpecials = filteredSpecials.reverse() 
        twiceFilteredSpecials = filteredSpecials
      } else {
        filteredSpecials.forEach(result => {
          if (result.locations !== undefined && result.locations.indexOf(state.storeLocation) !== -1) {
            twiceFilteredSpecials.push(result)
          }
        })
      }
      state.specials = twiceFilteredSpecials.reverse()
    }
  },
  actions: {
    changePageCategory(context, payload) { 
      context.commit('changePageCategory', payload) 
    },
    changeStoreLocation(context, payload) {
      context.commit('changeStoreLocation', payload)
    },
    fetchSpecials(context) {
      fetch(context.getters.specialsUrl)
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
      })
      .then(data => {
        if (this.productionSpecialsApi) {console.log('connecting to production server')}
        else {console.log('connecting to dev server')}
        console.log(`data`)
        console.log(data)
        console.log(new Date())
        const results = []
        for (const id in data) {
          let locations = data[id].locations.split(',')
          results.push({
            id: data[id].id,
            title: data[id].title,
            locations,
            description: data[id].description,
            start: new Date(data[id].start_time),
            end: new Date(data[id].end_time),
            startNumber: data[id].start_time,
            endNumber: data[id].end_time,
            reoccuringWeekend: data[id].reoccuring_weekend,
          })
        }
        console.log(`results`)
        console.log(results)
        context.commit('filterSpecials', results)
      })
      .catch((error) => {
        console.log(error)
        console.log("there was an error in the fetch GET promise chain")
        this.isLoading = false
        this.error = 'Failed to fetch data please try again later'
      })
    },
  },
  getters: {
    specialsUrl(state) {
      return state.productionSpecialsApi 
      ? 'https://138.68.240.44/specials/'
      : 'http://192.168.1.2:8000/specials/'
    },
    strainsUrl(state) {
      return state.productionStrainsApi 
      ? ''
      : ''
    },
    pageCategory(state) {
      return state.pageCategory
    },
    storeLocation(state) {
      return state.storeLocation
    },
    specials(state) {
      return state.specials
    },
    authenticated(state) {
      return state.authenticated
    }
  } 
})
export default store