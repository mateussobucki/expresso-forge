import { BaseGenerator } from "./baseGenerator.js";

export class PrismaPostgresGenerator extends BaseGenerator{
  getFiles(){
    return {
      "prisma/schema.prisma": this.buildPrismaSchema(),
      "src/config/database.js": this.buildDatabaseConfig(),
      "src/repositories/userRepository.js": this.buildUserRepository(),
    };
  };

  getDependencies(){
    return { "@prisma/client": "^6.1.0" };
  };

  getDevDependencies(){
    return { "prisma": "^6.1.0" };
  };

  getScripts(){
    return {
      "postinstall": "prisma generate",
      "prisma:generate": "prisma generate",
      "prisma:migrate": "prisma migrate dev",
      "prisma:deploy": "prisma migrate deploy",
      "prisma:studio": "prisma studio",
    };
  };

  buildPrismaSchema(){
    const { useJWT } = this.options;

    const passwordField = useJWT
      ? `
  password  String`
      : "";

    return `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid()) @db.Uuid
  name      String
  email     String   @unique${passwordField}
  createdAt DateTime @default(now()) @map("created_at")

  @@map("users")
}
`;
  };

  buildDatabaseConfig(){
    return `import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

export default prisma;
`;
  };

  buildUserRepository(){
    return `import prisma from "../config/database.js";

export async function createUser({ name, email, password }) {
  return prisma.user.create({
    data: { name, email, password },
    select: { id: true, name: true, email: true },
  });
}

export async function findUserByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}
`;
  };
}

