export function buildServerJs({ useMongoDB, useJWT, useSocketIO }){
  const imports = [
    `import express from "express";`,
    `import dotenv from "dotenv";`,
  ]

  if(useMongoDB) imports.push(`import mongoose from "mongoose";`);
  if(useSocketIO) imports.push(`import { createServer } from "http";`, `import { Server } from "socket.io";`);
  if(useJWT) imports.push(`import authRoutes from "./src/routes/authRoutes.js"`)

  const mongoConnect = useMongoDB 
  ? `
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("Error trying to connect to MongoDB:", err))
` 
    : "";

  const socketSetup = useSocketIO
    ? `
const httpServer = createServer(app);
const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);
  });
  `
  : "";
  
  const authRouteSetup = useJWT ? `app.use("/auth", authRoutes);\n` : "";

  const listen = useSocketIO
    ? `httpServer.listen(PORT, () => console.log(\`Server running on port: \${PORT}\`));`
    : `app.listen(PORT, () => console.log(\`Server running on port: \${PORT}\`));`;

  return `${imports.join("\n")}

dotenv.config();

const app = express();
app.use(express.json());
${mongoConnect}${socketSetup}${authRouteSetup}
const PORT = process.env.PORT || 3000;


app.get("/", (req, res) => {
  res.json({ message: "API rodando!" });
});

${listen}
`;
};