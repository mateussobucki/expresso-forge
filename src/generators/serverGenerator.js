import { BaseGenerator } from "./baseGenerator.js";

export class ServerGenerator extends BaseGenerator{
  getFiles(){
    return {"server.js": this.buildServerJs()};
  };

  //socket.io deps are loaded here
  getDependencies(){
    const { useSocketIO } = this.options;
    const deps = {};
    if (useSocketIO) deps["socket.io"] = "^4.7.5";
    return deps;
  };

  getFeatures(){
    const { database, useJWT, useSocketIO } = this.options;

    return [
      {
        active: database === "mongodb",
        imports: [`import mongoose from "mongoose";`],
        setup: `
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("Error trying to connect to MongoDB:", err))
` 
      },
      {
        active: database === "postgres",
        imports: [`import pool from "./src/config/database.js"`],
        setup: `
          pool.query("SELECT NOW()")
  .then(() => console.log("PostgreSQL connected"))
  .catch((err) => console.error("PostgreSQL connection error:", err));
        `
      },
      {
        active: useJWT,
        imports: [
          `import jwt from "jsonwebtoken"`,
          `import authRoutes from "./src/routes/authRoutes.js"`
        ],
        setup: `app.use("/auth", authRoutes);\n`
      },
      {
        active: useSocketIO,
        imports: [
          `import { createServer } from "http";`,
          `import { Server } from "socket.io";`
        ],
        setup: `
const httpServer = createServer(app);
const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);
});
`,
      },
    ].filter(feature => feature.active);
  };

  buildServerJs(){
    const features = this.getFeatures();

    const imports = [
    `import express from "express";`,
    `import dotenv from "dotenv";`,
    ...features.flatMap(f => f.imports),
  ]

  const setup = features.map(f => f.setup).join("");

  const listen = features.useSocketIO
    ? `httpServer.listen(PORT, () => console.log(\`Server running on port: \${PORT}\`));`
    : `app.listen(PORT, () => console.log(\`Server running on port: \${PORT}\`));`;

  return `${imports.join("\n")}

dotenv.config();

const app = express();
app.use(express.json());
${setup}
const PORT = process.env.PORT || 3000;


app.get("/", (req, res) => {
  res.json({ message: "API running!" });
});

${listen}
`;
  };
};