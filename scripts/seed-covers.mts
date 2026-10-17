/**
 * Carga en Firestore las portadas de scripts/covers/<id-del-libro>.jpg.
 *   pnpm seed-covers
 * Usa la misma lógica que saveCover (lib/data/books.ts): guarda la imagen en base64 en `bookCovers`,
 * sube `coverVersion` y `updatedAt` del libro para que la sincronización incremental la entregue.
 * Es seguro repetirlo: si la imagen ya es idéntica, no cambia nada.
 * Procedencia de cada imagen: scripts/covers/SOURCES.md
 */
import { readdirSync, readFileSync } from "node:fs";
import { basename, extname, join } from "node:path";
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const MAX_BASE64 = 700_000; // mismo límite que MAX_COVER_BASE64_LENGTH

for (const key of ["FIREBASE_PROJECT_ID", "FIREBASE_CLIENT_EMAIL", "FIREBASE_PRIVATE_KEY"]) {
  if (!process.env[key]) {
    console.error(`Falta ${key}. Completa .env a partir de .env.example`);
    process.exit(1);
  }
}

initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID!,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
    privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
  }),
});
const db = getFirestore();

const dir = join(import.meta.dirname, "covers");
const files = readdirSync(dir).filter((f) => extname(f) === ".jpg");

for (const file of files) {
  const id = basename(file, ".jpg");
  const bytes = readFileSync(join(dir, file));
  // No se confía en la extensión: se comprueban los bytes reales (JPEG = FF D8 FF).
  if (!(bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff)) {
    console.error(`✗ ${id}: no es un JPEG válido`);
    process.exitCode = 1;
    continue;
  }
  const data = bytes.toString("base64");
  if (data.length > MAX_BASE64) {
    console.error(`✗ ${id}: la imagen supera el límite (${data.length} caracteres base64)`);
    process.exitCode = 1;
    continue;
  }

  const bookRef = db.collection("books").doc(id);
  const coverRef = db.collection("bookCovers").doc(id);
  const result = await db.runTransaction(async (tx) => {
    const [book, cover] = await Promise.all([tx.get(bookRef), tx.get(coverRef)]);
    if (!book.exists) return "libro no existe (¿ejecutaste pnpm seed?)";
    if (cover.exists && cover.data()?.data === data) return "sin cambios";
    const now = new Date().toISOString();
    const version = ((book.data()?.coverVersion as number | undefined) ?? 0) + 1;
    tx.set(coverRef, { contentType: "image/jpeg", data, updatedAt: now });
    tx.update(bookRef, { coverVersion: version, updatedAt: now });
    return `portada v${version} (${Math.round(bytes.length / 1024)} KB)`;
  });
  console.log(`${result.startsWith("portada") ? "+" : "="} ${id}: ${result}`);
}
