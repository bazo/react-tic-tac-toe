export function times<T = unknown>(func: (i: number) => T, count: number): T[] {
	const res = [];

	for (let i = 0; i < count; i++) {
		res.push(func(i));
	}

	return res;
}

export function repeat<T = unknown>(item: T, count: number): T[] {
	return times(() => item, count);
}
