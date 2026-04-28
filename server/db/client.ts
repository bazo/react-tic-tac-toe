import { PrismaClient } from "../generated/prisma/client.js";

export async function createDbConnection(databaseUrl: string, authToken?: string) {
	if (databaseUrl.startsWith("mysql://")) {
		const { PrismaMariaDb } = await import("@prisma/adapter-mariadb");
		const adapter = new PrismaMariaDb(databaseUrl);
		return new PrismaClient({ adapter });
	} else if (databaseUrl.startsWith("libsql://")) {
		const { PrismaLibSql } = await import("@prisma/adapter-libsql");
		const adapter = new PrismaLibSql({ url: databaseUrl, authToken });
		return new PrismaClient({ adapter });
	} else {
		const { PrismaLibSql } = await import("@prisma/adapter-libsql");
		const adapter = new PrismaLibSql({ url: `file:${databaseUrl}` });
		return new PrismaClient({ adapter });
	}
}
