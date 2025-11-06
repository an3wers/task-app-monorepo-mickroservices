import { PrismaClient } from "@prisma/client";

// Расширение PrismaClient для логирования
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: [
      { level: "query", emit: "event" },
      { level: "error", emit: "stdout" },
      { level: "warn", emit: "stdout" },
    ],
  });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Singleton паттерн для предотвращения множественных подключений
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

// Логирование запросов в development режиме
if (process.env.NODE_ENV === "development") {
  prisma.$on("query", (e) => {
    console.log("Query: " + e.query);
    console.log("Duration: " + e.duration + "ms");
  });
}

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}

export { prisma };

// Экспортируем типы из Prisma для использования в сервисах
export * from "@prisma/client";

// Хелпер для graceful shutdown
export async function disconnectPrisma() {
  await prisma.$disconnect();
}

// Хелпер для проверки подключения
export async function checkDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    return false;
  }
}

// Middleware для транзакций (опционально)
export async function withTransaction<T>(
  callback: (prisma: PrismaClient) => Promise<T>,
): Promise<T> {
  return prisma.$transaction(callback as any) as Promise<T>;
}
