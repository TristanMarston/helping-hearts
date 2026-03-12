import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const connectionString = (process.env.NODE_ENV === 'development' ? process.env.DIRECT_URL : process.env.DATABASE_URL) || process.env.DATABASE_URL;

// const pool = new Pool({ connectionString });
// const adapter = new PrismaPg(pool);

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
    globalForPrisma.prisma ||
    (() => {
        const pool = new Pool({
            connectionString,
            max: 1,
        });
        const adapter = new PrismaPg(pool);
        return new PrismaClient({
            adapter,
        });
    })();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
