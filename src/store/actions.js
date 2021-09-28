export default {
  changePageCategory(state, payload) { 
    console.log(payload.value)
    state.pageCategory = payload.value
  },
}