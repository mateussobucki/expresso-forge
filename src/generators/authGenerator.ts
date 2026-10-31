import type { DependencyMap, FileMap } from "../types.js";
import { BaseGenerator } from "./baseGenerator.js";

export class AuthGenerator extends BaseGenerator{
  override getFiles(): FileMap {
    return {
      "src/controllers/authController.js": this.buildAuthController(),
      "src/routes/authRoutes.js": this.buildAuthRoutes(),
      "src/middlewares/authMiddleware.js": this.buildAuthMiddleware(),
    };
  };

  override getDependencies(): DependencyMap {
    return {
      jsonwebtoken: "^9.0.2",
      bcrypt: "^5.1.1",
    };
  };

  private buildAuthController(): string {
    const { database } = this.options;
    
    //Postgres
    if(database === "postgres"){
                return `import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../repositories/userRepository.js";

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUser({ name, email, password: hashedPassword });

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);

    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
`;
    };

    //MongoDB
    if(database === "mongodb"){
      return `import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
  
export async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const user = await User.create({ name, email, password: hashedPassword });
  
    res.status(201).json({ id: user._id, name: user.name, email: user.email });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
  
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
  
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
  
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: "Invalid credentials" });
  
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
  
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}`;
    };

    throw new Error("JWT authentication requires a database (MongoDB or PostgreSQL).");
  };

  private buildAuthRoutes(): string {
    return `import { Router } from "express";
import { register, login } from "../controllers/authController.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);

export default router;`;
  };

  private buildAuthMiddleware(): string {
    return `import jwt from "jsonwebtoken"

export function authMiddleware(req, res, next){
  const authHeader = req.headers.authorization;
  if(!authHeader){
    return res.status(401).json({error: "Token not informed"})
  };

  const [, token] = authHeader.split(" ");

  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  }
  catch(err){
    res.status(401).json({error: "Invalid Token"});
  }
}
  `;
  };
};