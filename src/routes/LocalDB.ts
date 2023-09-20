import Dexie, { type Table, liveQuery } from 'dexie';
import { refresh_chats_writable_empty, refresh_chats_writable } from "../routes/LayoutWritable";

export interface Chat {
  index?: number;
  title: string,
  id: string;
  createdAt: Date,
  message?: Array<MessageDb>;
}

export interface MessageDb {
    content: string;
    from: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
}

export class ChatDatabase extends Dexie {
    chats!: Table<Chat>; 
  
    constructor() {
      super('blindchat');
      this.version(16).stores({
        chats: '++index, title, createdAt, id, message'
      });
    }
}

export async function createChat(id_chat: string, msg: MessageDb | undefined, title?: string) {
    try {
      let title_f = ""
      if (title === undefined) {
        let count = (await db.chats.count()) + 1
        title_f = "Untitled " + count
      }
      else
        title_f = title
      const chat = {
        id: id_chat,
        title: title_f,
        message: msg === undefined ? undefined : [msg],
        createdAt: new Date(),
      }
      const id = await db.chats.add(chat);
    } catch (error) {
        console.log(error)
    }
    let push = await getChats()
    refresh_chats_writable.set(push)
}

export async function deleteAllChats() {
  const chat_ret = await db.chats.clear()
  refresh_chats_writable_empty.set(true)
}

export async function deleteChat(id_chat: string) {
  const chat_ret = await db.chats.where("id").equals(id_chat).delete() 
  let count = await db.chats.count()
  if (count > 0) {
    let push = await getChats()
    refresh_chats_writable.set(push)
  }
  else {
    refresh_chats_writable_empty.set(true)
  }
}

export async function modifyTitle(id_chat: string, newTitle: string) {
  const chat_ret = db.chats.where("id").equals(id_chat)
  let count = await chat_ret.count() 
  if (count > 0) {
    let res = await chat_ret.first()
    chat_ret.modify({title: newTitle})
    let push = await getChats()
    refresh_chats_writable.set(push)
  }
}

export async function addMessageToChat(id_chat: string, msg: MessageDb) {
  const chat_ret = db.chats.where("id").equals(id_chat)
  let count = await chat_ret.count() 
  if (count < 1) {
    createChat(id_chat, msg, )
  }
  else {
    let msgs: MessageDb[]
    chat_ret.first().then((res) => {
      if (res?.message == undefined) {
        msgs.push(msg)
        res.message = msgs
      }
      res.message.push(msg)
      chat_ret.modify({id: id_chat, message: res.message})
    })
  }
}

export async function getTitle(id_chat: string) {
  try {
    const chat_ret = await db.chats.where("id").equals(id_chat).first()
    const title_ret = chat_ret?.title
    return title_ret
  }
  catch (err) {
    console.log(err)
  }
  return "Untitled"
}

export async function getMessages(id_chat: string) {
  try {
    const chat_ret = await db.chats.where("id").equals(id_chat).first()
    const msg = chat_ret?.message
    return [...msg]
  }
  catch (err) {
    console.log(err)
  }
  return undefined
}

export async function getChats() {
  let titles = []
  try {
    const all = (await db.chats.orderBy('createdAt').toArray()).forEach(function (chat) {
      titles.push({
        title: chat.title,
				model: "", // Hardcoded for now
				id: chat.id,
				updatedAt: chat.createdAt,
				createdAt: chat.createdAt,
      })
    });
  }
  catch (err) {
    console.log(err)
  }
  return titles;
}


export async function getChat(id_chat: string) {
  const chat_ret = db.chats.where("id").equals(id_chat).first().then((res) => {
    return res;
  })
}

export const db = new ChatDatabase();

  