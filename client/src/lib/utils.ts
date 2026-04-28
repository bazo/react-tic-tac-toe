import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatRelative(date: Date): string {
	const now = Date.now();
	const diff = now - date.getTime();
	const minute = 60_000;
	const hour = 60 * minute;
	const day = 24 * hour;

	if (diff < minute) return "just now";
	if (diff < hour) return `${Math.floor(diff / minute)}m ago`;
	if (diff < day) return `${Math.floor(diff / hour)}h ago`;
	if (diff < 7 * day) return `${Math.floor(diff / day)}d ago`;
	return date.toLocaleDateString();
}
