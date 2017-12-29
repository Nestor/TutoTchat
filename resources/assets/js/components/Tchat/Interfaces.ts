export interface IMessage {
  id: number
  from_id: number
  to_id: number
  content: string
  created_at: string
  seen_at: null|string
  from: {
    name: string
    id: number
  }
}

export interface IConversation {
  id: number
  name: string
  unread: number
  count: number
  messages: IMessage[]
}

export type IConversationResponse = {
    id: number,
    name: string,
    unread: number
}

export type IConversationsResponse = {
  conversations: IConversationResponse[]
}
