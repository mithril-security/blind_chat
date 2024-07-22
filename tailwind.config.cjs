const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

/** @type {import('tailwindcss').Config} */
export default {
	darkMode: "class",
	content: ["./src/**/*.{html,js,svelte,ts}"],
	theme: {
		extend: {
			colors: {
				primary: colors[process.env.PUBLIC_APP_COLOR],
				newPrimary: "#FDFDFD",
				secondary: "#F7F8FA",
				tertiary: "#0361BF",
				customBlack: "#202020",
				customGrey: "#7C7C7C",
				"ai-chat": "#1650a8",
				"user-chat": "#142F69",
				"privacy-banner": "#142343",
				prompts: "#394C75",
				"mini-sidemenu": "#0d1830",
				message: "#1e418b",
				chat: "#FDFDFD",
				sidebar: "#142343",
				"mithril-border": "#196398",
				login: "#052448",
				"mithril-yellow": "#f5c012",
				darkSidebar: "#121a28",
				lightSidebar: "#fbfcfd",
				darkBackground: "#111827",
				bannerBack: "#f3f4f6",
			},
			fontSize: {
				xxs: "0.625rem",
				smd: "0.94rem",
			},
		},
	},
	plugins: [
		require("tailwind-scrollbar")({ nocompatible: true }),
		require("@tailwindcss/typography"),
	],
};
