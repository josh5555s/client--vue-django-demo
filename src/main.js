import { createApp } from 'vue';
import App from './App.vue'
import store from './store/index'
import router from './router'
// import bodyParser from 'body-parser';

import BaseCard from './components/UI/BaseCard.vue'
import BaseButton from './components/UI/BaseButton.vue'
import BaseModal from './components/UI/BaseModal.vue'

const app = createApp(App)

app.component('base-card', BaseCard)
app.component('base-button', BaseButton)
app.component('base-modal', BaseModal)

app.use(store)
app.use(router)

app.mount('#app');