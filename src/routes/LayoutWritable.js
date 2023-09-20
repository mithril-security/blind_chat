import { writable } from "svelte/store";

export const isloading_writable = writable(false);
export const refresh_chats_writable = writable([]);
export const refresh_chats_writable_empty = writable(false);
