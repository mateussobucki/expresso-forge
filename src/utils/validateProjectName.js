import fs from "fs/promises";
import path from 'path'

export async function validateProjectName(projectName){
  const rootDir = path.join(process.cwd(), projectName);

  try{
    await fs.access(rootDir);
    throw new Error(`The folder "${projectName}" already exists.`);
  } catch(err){
    if(err.code !== "ENOENT"){
      throw err
    }
  }
}