import { BaseGenerator } from "./baseGenerator.js";
import type { DependencyMap, FileMap } from "../types.js";

export class MongoModelGenerator extends BaseGenerator{
  override getFiles(): FileMap {
    return {
      "src/models/User.js": this.buildUserModel(),
    };
  };

  override getDependencies(): DependencyMap {
    return { "mongoose": "^8.5.0" };
  };

  private buildUserModel(): string {
    const useJWT = this.options.useJWT;
    const passwordField = useJWT
    ? `
password: {
  type: String,
  required: true,
},` 
  : ""

  return `import mongoose from "mongoose";
  
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },${passwordField}
}, {timestamps: true});

export default mongoose.model("User", userSchema);
  `
  };
};