import Vue from 'vue'
import Vuex from 'vuex'
import { IState, State } from './State'
import * as Mutations from './Mutations'
import * as Actions from './Actions'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  state: State,
  mutations: Mutations,
  actions: Actions,
  getters: {
    messagesFor (state: IState) {
      return function (userId: string) {
        return state.conversations[userId] !== undefined && state.conversations[userId].messages !== undefined ? state.conversations[userId].messages : []
      }
    },
    conversations (state: IState) {
      return state.conversations
    },
    hasMoreMessage (state: IState) {
      return function (userId: number) {
        return state.conversations[userId] &&
          state.conversations[userId].messages &&
          state.conversations[userId].messages.length < state.conversations[userId].count
      }
    },
    isOpened (state: IState) {
      return function (conversationId: string) {
        return state.openedConversations.indexOf(conversationId) >= 0
      }
    },
    username (state: IState) {
      return function (userId: string) {
        return state.conversations[userId] ? state.conversations[userId].name : ''
      }
    }
  }
})
