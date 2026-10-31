import { BaseGenerator } from "./baseGenerator.js";
import type { FileMap } from "../types.js";

export class DockerGenerator extends BaseGenerator{
  override getFiles(): FileMap {
    return {
      "Dockerfile": this.buildDockerfile(),
      "docker-compose.yaml": this.buildDockerCompose(),
      ".dockerignore": this.buildDockerignore(),
    };
  };

  private buildDockerfile(): string {
    return `FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
`;
  };

  private buildDockerCompose(): string {
    const useMongoDB = this.options.database === "mongodb";
    const mongoService = useMongoDB
    ? `
  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
`
    : "";

  const dependsOn = useMongoDB
    ? `
    depends_on:
      - mongo`
    : "";

  const volumes = useMongoDB
    ? `
volumes:
  mongo-data:
`
    : "";

  return `services:
  app:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env${dependsOn}
${mongoService}${volumes}`;
  };

  private buildDockerignore(): string {
    return `node_modules
.env
.git
`;
  };
};