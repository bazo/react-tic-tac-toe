import { env } from "@/env";

export const apiUrl = import.meta.env.DEV ? env.VITE_API_URL : window.location.origin;
