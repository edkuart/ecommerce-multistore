import type { Request, Response } from "express";
import * as leadService from "../services/lead.service";
import { resolveStoreFilter } from "../shared/utils/storeAccess";

function parseString(value: unknown): string | undefined {
  if (Array.isArray(value)) return parseString(value[0]);
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

export async function getLeads(req: Request, res: Response): Promise<void> {
  const storeFilter = await resolveStoreFilter(
    req.user!.id,
    req.user!.role,
    parseString(req.query.storeId),
  );
  if (!storeFilter.allowed) {
    res.status(403).json({ message: storeFilter.reason });
    return;
  }

  const leads = await leadService.listLeads({
    storeId: storeFilter.storeId,
  });
  res.status(200).json(leads);
}
