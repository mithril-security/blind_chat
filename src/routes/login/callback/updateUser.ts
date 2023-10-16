import { authCondition, refreshSessionCookie } from "$lib/server/auth";
import { collections } from "$lib/server/database";
import { DEFAULT_SETTINGS } from "$lib/types/Settings";
import { z } from "zod";
import type { UserinfoResponse } from "openid-client";
import type { Cookies } from "@sveltejs/kit";

export async function updateUser(params: {
	userData: UserinfoResponse;
	locals: App.Locals;
	cookies: Cookies;
}) {}
