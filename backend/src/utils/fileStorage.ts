import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { env } from "../config/env";

const UPLOADS_DIR = path.join(__dirname, "../../uploads");

export async function saveBase64Image(subdir: string, base64Data: string): Promise<string> {
  const dir = path.join(UPLOADS_DIR, subdir);
  await fs.mkdir(dir, { recursive: true });

  const filename = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}.png`;
  await fs.writeFile(path.join(dir, filename), Buffer.from(base64Data, "base64"));

  return `${env.publicBaseUrl}/uploads/${subdir}/${filename}`;
}

export { UPLOADS_DIR };
