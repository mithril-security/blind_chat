import { writable } from "svelte/store";

export const progress_writable = writable(0);
export const curr_model_writable = writable("");
export const map_writable = writable(["", ""]);
export const phi_writable = writable(false);
