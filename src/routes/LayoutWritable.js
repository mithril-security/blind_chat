import { writable } from "svelte/store";

export const isloading_writable = writable(false);
export const is_init_writable = writable(false);
export const cancel_writable = writable(false);
export const refresh_chats_writable = writable([]);
export const refresh_chats_writable_empty = writable(false);
export const curr_model_writable = writable(0);
export const curr_model_writable_string = writable("");
export const api_key_writable = writable("");
export const jwt_writable = writable("");
export const is_logged_writable = writable(false);
export const first_time_writable = writable(true);
export const email_addr_writable = writable("");
export const is_magic_writable = writable(false);
export const showLoggedPopup_writable = writable(false);
export const userWritable = writable(undefined);
export const helpMenu = writable(false);
