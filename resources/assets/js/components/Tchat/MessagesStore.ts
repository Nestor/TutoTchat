import {Request} from '../../libs/Request'
import { IMessage, IConversation, IConversationsResponse, IConversationResponse } from './Interfaces'
import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  state: {
    conversations: {} as {[key: string]: IConversation}
  },
  mutations: {
    readConversation (state, id: string) {
      state.conversations[id].unread = 0
    },
    addMessages (state, {conversation, userId}) {
      if (state.conversations[userId]) {
        state.conversations[userId].messages = [...conversation.messages, ...state.conversations[userId].messages]
      } else {
        Vue.set(state.conversations, userId, conversation)
      }
    },
    addMessage (state, {message, userId}) {
      state.conversations[userId].messages.push(message)
      state.conversations[userId].count++
    },
    addConversations (state, conversations: IConversationResponse[]) {
      conversations.forEach((conversation) => {
        if (state.conversations[conversation.id]) {
          state.conversations[conversation.id] = Object.assign({}, state.conversations[conversation.id], conversation)
        } else {
          Vue.set(state.conversations, conversation.id.toString(), Object.assign({messages: [], count: 0}, conversation))
        }
      })
    },
  },
  getters: {
    messagesFor (state) {
      return function (userId: number) {
        return state.conversations[userId] ? state.conversations[userId].messages : []
      }
    },
    conversations (state) {
      return state.conversations
    },
    hasMoreMessage (state) {
      return function (userId: number) {
        return state.conversations[userId].messages.length < state.conversations[userId].count
      }
    },
    username (state) {
      return function (userId: string) {
        return state.conversations[userId] ? state.conversations[userId].name : ''
      }
    }
  },
  actions: {
    async loadConversations (context) {
      const conversations = await Request.get('/api/conversations') as IConversationsResponse
      return context.commit('addConversations', conversations.conversations)
    },
    async loadMessagesFor (context, userId: number) {
      let message = context.getters.messagesFor(userId)[0]
      let url = '/api/conversations/' + userId
      if (message) { url +=  '?before=' + message.created_at }
      let response = await Request.get(url) as IConversation
      context.commit('addMessages', {userId: userId, conversation: response})
      return response
    },
    async sendMessageTo (context, {userId, message}: {userId: number, message: string}) {
      let response = await Request.post('/api/conversations', {
        content: message,
        to_id: userId
      }) as IMessage
      context.commit('addMessage', {message: response, userId})
      return response
    }
  }
})

