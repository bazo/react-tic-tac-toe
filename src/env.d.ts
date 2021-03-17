/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-explicit-any */

/// <reference types="node" />

import { Expect } from "expect/build/types";

export declare const describe: testing.Describe;
export declare const test: testing.Test;
export declare const expect: Expect;

declare namespace testing {
	interface FunctionLike {
		readonly name: string;
	}

	type EmptyFunction = () => void;
	type NameFunction = () => string | Promise<string>;

	interface Test {
		/**
		 * Creates a test closure.
		 *
		 * @param name The name of your test
		 * @param fn The function for your test
		 */
		(name: number | string | FunctionLike | NameFunction, fn: EmptyFunction): void;
	}

	interface Describe {
		/**
		 * Creates a suite closure.
		 *
		 * @param name The name of your suite
		 * @param fn The function for your suite
		 */
		(name: number | string | FunctionLike | NameFunction, fn: EmptyFunction): void;
	}
}
