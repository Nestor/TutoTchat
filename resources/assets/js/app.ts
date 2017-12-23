import Vue from 'vue'
import Tchat from './components/Tchat.vue'
import Messages from './components/Tchat/Messages.vue'
import VueRouter from 'vue-router'
import store from './components/Tchat/MessagesStore'

Vue.use(VueRouter)

let conversations = document.querySelector('#conversations')

if (conversations) {

  const routes = [
    { path: '/' },
    { path: '/:id', component: Messages, name: 'conversation' },
  ]

  const router = new VueRouter({
    mode: 'history',
    routes,
    base: conversations.getAttribute('data-base') as string
  })

  new Vue({
    el: '#conversations',
    components: {Tchat},
    store,
    router,
    render (h) {
      return h('Tchat', {attrs: {user: (conversations as Element).getAttribute('data-userid')}})
    }
  })
}

