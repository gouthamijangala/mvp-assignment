import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

// #region agent log
const dbUrl = process.env.DATABASE_URL;
console.error('[DEBUG] Prisma DB connection check:', {
  sessionId: '673c5e',
  location: 'src/server/db.ts:10',
  message: 'DATABASE_URL env var check',
  data: {
    hasDatabaseUrl: !!dbUrl,
    databaseUrlLength: dbUrl?.length || 0,
    databaseUrlIsUndefined: dbUrl === undefined,
    databaseUrlIsEmpty: dbUrl === '',
    databaseUrlPreview: dbUrl ? `${dbUrl.substring(0, 20)}...${dbUrl.substring(Math.max(0, dbUrl.length - 10))}` : 'N/A',
    nodeEnv: process.env.NODE_ENV,
    allEnvKeysWithDB: Object.keys(process.env).filter(k => k.includes('DATABASE') || k.includes('DB')).join(',')
  },
  timestamp: Date.now(),
  runId: 'vercel',
  hypothesisId: 'E'
});
fetch('http://127.0.0.1:7823/ingest/84337e17-207d-4a10-b493-89d4fd5491b2',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'673c5e'},body:JSON.stringify({sessionId:'673c5e',location:'src/server/db.ts:10',message:'DATABASE_URL env var check',data:{hasDatabaseUrl:!!dbUrl,databaseUrlLength:dbUrl?.length||0,databaseUrlIsUndefined:dbUrl===undefined,databaseUrlIsEmpty:dbUrl==='',nodeEnv:process.env.NODE_ENV},timestamp:Date.now(),runId:'vercel',hypothesisId:'E'})}).catch(()=>{});
// #endregion

export const db: PrismaClient =
  global.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = db;
}

