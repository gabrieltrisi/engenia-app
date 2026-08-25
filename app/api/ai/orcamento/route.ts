import { randomUUID } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { NextResponse } from "next/server";
import { analyzeBudgetImage } from "@/services/ai/orcamento";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 8 * 1024 * 1024;
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function POST(request: Request) {
  let tempPath: string | null = null;

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { message: "Envie uma imagem no campo file." },
        { status: 400 },
      );
    }

    if (!allowedTypes.has(file.type)) {
      return NextResponse.json(
        { message: "Formato de imagem nao suportado." },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { message: "A imagem deve ter ate 8MB." },
        { status: 400 },
      );
    }

    const tempDir = join(tmpdir(), "engenia-ai");
    await mkdir(tempDir, { recursive: true });

    tempPath = join(tempDir, `${randomUUID()}-${file.name || "upload"}`);
    await writeFile(tempPath, Buffer.from(await file.arrayBuffer()));

    const imageBase64 = (await readFile(tempPath)).toString("base64");
    const result = await analyzeBudgetImage({
      imageBase64,
      mimeType: file.type,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[api/ai/orcamento]", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Erro interno ao gerar orcamento por imagem.",
      },
      { status: 500 },
    );
  } finally {
    if (tempPath) {
      await rm(tempPath, { force: true }).catch((error) => {
        console.error("[api/ai/orcamento] cleanup", error);
      });
    }
  }
}
