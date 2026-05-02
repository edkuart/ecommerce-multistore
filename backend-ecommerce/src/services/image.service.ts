import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import fs from "fs/promises";
import path from "path";

const BUCKET = "product-images";

let bucketReady: Promise<void> | null = null;

function getSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function hasSupabaseStorageConfig(): boolean {
  return Boolean(
    process.env.SUPABASE_URL?.trim() &&
      process.env.SUPABASE_SERVICE_ROLE_KEY?.trim(),
  );
}

function getExtension(file: Express.Multer.File): string {
  switch (file.mimetype) {
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    case "image/avif":
      return "avif";
    default:
      return "jpg";
  }
}

function sanitizeFileName(name: string): string {
  return name
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

async function ensureProductImagesBucket(): Promise<void> {
  if (!bucketReady) {
    bucketReady = (async () => {
      const supabase = getSupabaseClient();
      const { data: buckets, error: listError } =
        await supabase.storage.listBuckets();

      if (listError) {
        throw new Error(`Could not list Supabase buckets: ${listError.message}`);
      }

      const exists = buckets.some((bucket) => bucket.name === BUCKET);

      if (!exists) {
        const { error } = await supabase.storage.createBucket(BUCKET, {
          public: true,
          fileSizeLimit: 8 * 1024 * 1024,
          allowedMimeTypes: [
            "image/png",
            "image/jpeg",
            "image/jpg",
            "image/webp",
            "image/gif",
            "image/avif",
          ],
        });

        if (error) {
          throw new Error(`Could not create Supabase bucket: ${error.message}`);
        }

        return;
      }

      const { error } = await supabase.storage.updateBucket(BUCKET, {
        public: true,
      });

      if (error) {
        throw new Error(`Could not update Supabase bucket: ${error.message}`);
      }
    })();
  }

  return bucketReady;
}

async function uploadProductImagesLocally(
  files: Express.Multer.File[],
): Promise<string[]> {
  const uploadDir = path.join(process.cwd(), "uploads", "product-images");
  await fs.mkdir(uploadDir, { recursive: true });

  const urls: string[] = [];

  for (const file of files) {
    const ext = getExtension(file);
    const safeName = sanitizeFileName(file.originalname) || "product";
    const fileName = `${Date.now()}-${crypto.randomUUID()}-${safeName}.${ext}`;
    const filePath = path.join(uploadDir, fileName);

    await fs.writeFile(filePath, file.buffer);
    urls.push(`/uploads/product-images/${fileName}`);
  }

  return urls;
}

export async function uploadProductImages(
  files: Express.Multer.File[] | undefined,
): Promise<string[]> {
  if (!files?.length) return [];

  if (!hasSupabaseStorageConfig()) {
    return uploadProductImagesLocally(files);
  }

  await ensureProductImagesBucket();

  const supabase = getSupabaseClient();
  const urls: string[] = [];

  for (const file of files) {
    const ext = getExtension(file);
    const safeName = sanitizeFileName(file.originalname) || "product";
    const path = `products/${Date.now()}-${Math.round(
      Math.random() * 1e9,
    )}-${safeName}.${ext}`;

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      throw new Error(`Could not upload image: ${error.message}`);
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    urls.push(data.publicUrl);
  }

  return urls;
}
