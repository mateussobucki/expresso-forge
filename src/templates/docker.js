export function buildDockerFile(){
    return `FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
`;
}

export function buildDockerCompose({ useMongoDB }) {
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

export function buildDockerignore() {
  return `node_modules
.env
.git
`;
};