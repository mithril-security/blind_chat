import { writable } from "svelte/store";

export const isloading_writable = writable(false);
export const is_init_writable = writable(false);
export const cancel_writable = writable(false);
export const refresh_chats_writable = writable([]);
export const refresh_chats_writable_empty = writable(false);
export const curr_model_writable = writable(0);
export const curr_model_writable_string = writable("");
