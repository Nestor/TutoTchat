import { ActionContext } from 'vuex'
import { IState } from './State'
import { Request } from '../../../libs/Request'
import { IConversation, IConversationsResponse, IMessage } from '../Interfaces'
import Echo from 'laravel-echo'
import Favico from 'favico.js'

type Context = ActionContext<IState, {}>

let title = document.title

export const loadConversations = async function (context: Context) {
  const conversations = await Request.get('/api/conversations') as IConversationsResponse
  return context.commit('addConversations', conversations.conversations)
}

export const loadMessagesFor = async function (context: Context, userId: number) {
  console.log('loadMessageFor', userId)
  if (
    context.state.conversations[userId] === undefined ||
    context.state.conversations[userId].loaded === false
  ) {
    let url = '/api/conversations/' + userId
    let response = await Request.get(url) as IConversation
    context.commit('addMessages', {userId: userId, conversation: response})
  }
  context.state.conversations[userId].messages.forEach(message => {
    if (message.seen_at === null) {
      markAsRead(context, message)
    }
  })
  return
}

export const loadPreviousMessagesFor = async function (context: Context, userId: number) {
  let message = context.getters.messagesFor(userId)[0]
  if (message) {
    let url = '/api/conversations/' + userId + '?before=' + message.created_at
    let response = await Request.get(url) as IConversation
    context.commit('addMessages', {userId: userId, conversation: response})
    return response
  }
}

export const sendMessageTo = async function (context: Context, {userId, message}: {userId: number, message: string}) {
  let response = await Request.post('/api/conversations', {
    content: message,
    to_id: userId
  }) as IMessage
  context.commit('addMessage', {message: response, userId})
  return response
}

export const listenToMessage = function (context: Context, userId: string) {
  let e = new Echo({
    broadcaster: 'socket.io',
    host: window.location.hostname + ':6001'
  })
  e
    .private(`App.User.${userId}`)
    .listen('NewMessage', function (e: {message: IMessage}) {
      let conversation = context.state.conversations[e.message.from_id]
      if (conversation && conversation.messages) {
        context.commit('addMessage', {message: e.message, userId: e.message.from_id})
      }
      if (!context.getters.isOpened(e.message.from_id) || document.hidden) {
        let audio = new Audio('/sounds/notification.mp3')
        audio.play()
        context.commit('incrementUnread', e.message.from_id)
        updateTitle(context)
      } else {
        markAsRead(context, e.message)
      }
    })
}

export const markAsRead = async function (context: Context, message: IMessage) {
  let response = await Request.post('/api/conversations/' + message.id + '/seen')
  context.commit('readMessage', {message: message})
  updateTitle(context)
  return response
}

export const openConversation = async function (context: Context, id: number) {
  context.commit('openConversation', id)
}


let favicon = new Favico({
  animation:'none'
})

export const updateTitle = function (context: Context) {
  let unread = Object.values(context.state.conversations).reduce((acc: number, conversation) => conversation.unread + acc, 0)
  console.log('unread', unread)
  if (unread === 0) {
    document.title = `${title}`
    favicon.reset()
  } else {
    favicon.badge(unread)
    document.title = `(${unread}) ${title}`
  }
}
