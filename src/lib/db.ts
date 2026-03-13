import { PrismaClient } from "@prisma/client";
import { PrismaMssql } from "@prisma/adapter-mssql";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createClient(): PrismaClient {
  const server = process.env.AZURE_SQL_SERVER;
  const token = process.env.AZURE_SQL_TOKEN;
  
  if (server && token) {
    // Decode token for debugging
    try {
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      console.log(`DB Auth: oid=${payload.oid} appid=${payload.appid}`);
    } catch(e) { console.log('Token decode failed'); }
    
    const adapter = new PrismaMssql({
      server,
      port: 1433,
      database: process.env.AZURE_SQL_DATABASE || "coffee-journal-db",
      authentication: {
        type: "azure-active-directory-access-token",
        options: { token },
      },
      options: {
        encrypt: true,
        trustServerCertificate: false,
        connectTimeout: 120000,
        requestTimeout: 30000,
      },
    });
    return new PrismaClient({ adapter } as any);
  }
  return new PrismaClient();
}

export const prisma = globalForPrisma.prisma || createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
