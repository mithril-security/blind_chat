export function switchTheme() {
	const { classList } = document.querySelector("html") as HTMLElement;
	classList.add("dark");
	localStorage.theme = "dark";
}
