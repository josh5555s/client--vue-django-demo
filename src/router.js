import { createRouter, createWebHistory } from 'vue-router'

import SpecialsPage from './components/pages/SpecialsPage/SpecialsPage'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/specials' },
    {
      name: 'all',
      path: '/specials',
      components: {
        body: SpecialsPage,
      },
    },
    { path: '/:pathMatch(.*)*', redirect: '/'}
  ]
})

export default router