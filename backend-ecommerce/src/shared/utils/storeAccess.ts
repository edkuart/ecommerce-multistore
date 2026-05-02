import { StoreUser } from "../../models/StoreUser";

/**
 * Returns storeIds the given user is linked to via StoreUser.
 * Admins (role = 'admin') bypass the check and get an empty array meaning "all stores".
 */
export async function getUserStoreIds(userId: number): Promise<string[]> {
  const rows = await StoreUser.findAll({
    where: { userId },
    attributes: ["storeId"],
  });
  return rows.map((row) => row.storeId);
}

/**
 * Resolves the effective storeId filter for an admin request.
 *
 * - If the user is 'admin' role: passes through the requested storeId as-is (full access).
 * - If the user is 'seller':
 *   - With storeId: validates it belongs to the user, throws 403 string if not.
 *   - Without storeId: returns undefined (caller can decide to scope by user stores).
 *
 * Returns:
 *   { allowed: true, storeId } — proceed with this storeId (may be undefined).
 *   { allowed: false, reason } — respond 403 with this message.
 */
export async function resolveStoreFilter(
  userId: number,
  role: string,
  requestedStoreId: string | undefined,
): Promise<
  | { allowed: true; storeId: string | undefined }
  | { allowed: false; reason: string }
> {
  if (role === "admin") {
    return { allowed: true, storeId: requestedStoreId };
  }

  const userStoreIds = await getUserStoreIds(userId);

  if (requestedStoreId) {
    if (!userStoreIds.includes(requestedStoreId)) {
      return { allowed: false, reason: "Access to this store is not allowed" };
    }
    return { allowed: true, storeId: requestedStoreId };
  }

  // No storeId specified — scope to user's stores.
  // Return undefined so caller can decide; user stores list is returned separately.
  return { allowed: true, storeId: undefined };
}
