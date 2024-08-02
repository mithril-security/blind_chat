import Dexie, { type Table, liveQuery } from "dexie";
import { refresh_chats_writable_empty, refresh_chats_writable } from "../routes/LayoutWritable";
import { env } from "$env/dynamic/public";

export interface Chat {
	index?: number;
	title: string;
	id: string;
	createdAt: Date;
	model: string;
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
		super("blindchat");
		this.version(16).stores({
			chats: null,
		});
		this.version(17).stores({
			chats: null,
		});
		this.version(18).stores({
			chats: "++index, title, createdAt, id, message, model",
		});
	}
}

export async function createChat(
	id_chat: string,
	msg: MessageDb | undefined,
	model: string,
	title?: string
) {
	try {
		let title_f = "";
		if (title === undefined) {
			const count = (await db.chats.count()) + 1;
			title_f = "Untitled " + count;
		} else title_f = title;
		const chat = {
			id: id_chat,
			title: title_f,
			message: msg === undefined ? undefined : [msg],
			createdAt: new Date(),
			model: model,
		};
		const id = await db.chats.add(chat);
	} catch (error) {
		console.log(error);
	}
	const push = await getChats();
	refresh_chats_writable.set(push);
}

export async function deleteAllChats() {
	const chat_ret = await db.chats.clear();
	refresh_chats_writable_empty.set(true);
}

export async function deleteChat(id_chat: string) {
	const chat_ret = await db.chats.where("id").equals(id_chat).delete();
	const count = await db.chats.count();
	if (count > 0) {
		const push = await getChats();
		refresh_chats_writable.set(push);
	} else {
		refresh_chats_writable_empty.set(true);
	}
}

export async function modifyTitle(id_chat: string, newTitle: string) {
	const chat_ret = db.chats.where("id").equals(id_chat);
	const count = await chat_ret.count();
	if (count > 0) {
		const res = await chat_ret.first();
		chat_ret.modify({ title: newTitle });
		const push = await getChats();
		refresh_chats_writable.set(push);
	}
}

export async function addMessageToChat(id_chat: string, msg: MessageDb, model: string) {
	const chat_ret = db.chats.where("id").equals(id_chat);
	const count = await chat_ret.count();
	if (count < 1) {
		createChat(id_chat, msg, model);
	} else {
		let msgs: MessageDb[];
		chat_ret.first().then((res) => {
			if (res?.message == undefined) {
				msgs.push(msg);
				res.message = msgs;
			}
			res.message.push(msg);
			chat_ret.modify({ id: id_chat, message: res.message });
		});
	}
}

export async function getTitle(id_chat: string) {
	let title_ret = env.PUBLIC_APP_NAME;
	try {
		const chat_ret = await db.chats.where("id").equals(id_chat).first();
		title_ret = chat_ret!.title;
	} catch (err) {
		console.log(err);
	}
	return title_ret;
}

export async function getMessages(id_chat: string) {
	try {
		const chat_ret = await db.chats.where("id").equals(id_chat).first();
		const msg = chat_ret?.message;
		return msg ? [...msg] : [];
	} catch (err) {
		console.log(err);
	}
	return undefined;
}

export async function getModel(id_chat: string) {
	try {
		const chat_ret = await db.chats.where("id").equals(id_chat).first();
		const model = chat_ret?.model;
		if (model === undefined) return "";
		return model;
	} catch (err) {
		console.log(err);
	}
	return "";
}

export async function getChats() {
	const titles = [];
	try {
		const all = (await db.chats.orderBy("createdAt").toArray()).forEach(function (chat) {
			titles.push({
				title: chat.title,
				model: "", // Hardcoded for now
				id: chat.id,
				updatedAt: chat.createdAt,
				createdAt: chat.createdAt,
			});
		});
	} catch (err) {
		console.log(err);
	}
	return titles;
}

export async function getChat(id_chat: string) {
	const chat_ret = db.chats
		.where("id")
		.equals(id_chat)
		.first()
		.then((res) => {
			return res;
		});
}

export const db = new ChatDatabase();
