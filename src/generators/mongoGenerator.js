import { BaseGenerator } from "./baseGenerator.js";

export class MongoModelGenerator extends BaseGenerator{
  getFiles(){
    return {
      "src/models/User.js": this.buildUserModel(),
    };
  };

  buildUserModel(){
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