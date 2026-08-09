export function buildUserModel({ useJWT }){
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