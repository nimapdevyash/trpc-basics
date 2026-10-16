import type { InferInsertModel, InferSelectModel, SQL } from "drizzle-orm";
import type {
  SQLiteColumn,
  SQLiteTable,
  SQLiteUpdateSetSource,
} from "drizzle-orm/sqlite-core";
import { and, eq } from "drizzle-orm";
import { db } from "../configs/database/index";

/**
 * Drizzle port of the Mongoose `dbOperations` helpers.
 *
 * Key differences from the Mongoose version:
 *   • You pass the TABLE OBJECT (`users`, `todos`), not a model-name string.
 *     That keeps full type inference: `findById({ table: users, id })` returns
 *     `User | undefined`, which flows through your procedures to the tRPC client.
 *     A string registry would erase those types (everything becomes `any`).
 *   • Filters are Drizzle SQL expressions (`eq(users.email, x)`, `and(...)`),
 *     not Mongo filter objects.
 *   • `populate` has no equivalent here — use the relational API directly:
 *     `db.query.users.findMany({ with: { todos: true } })`.
 *   • better-sqlite3 transactions are SYNCHRONOUS. Inside `db.transaction(tx => …)`
 *     you must not `await`; finish each query with `.run()` / `.all()` / `.get()`.
 */

/* ----------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */

/** Any table that has the shared `id` column from `commonComponents`. */
type TableWithId = SQLiteTable & { id: SQLiteColumn };

type Row<T extends SQLiteTable> = InferSelectModel<T>;
type NewRow<T extends SQLiteTable> = InferInsertModel<T>;

/** A transaction handle, so helpers can join an outer transaction. */
type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];
type Executor = typeof db | Tx;

type OrderBy = SQL | SQLiteColumn | (SQL | SQLiteColumn)[];

const toArray = <V>(v: V | V[]): V[] => (Array.isArray(v) ? v : [v]);

/* ----------------------------------------------------------------------------
 * Create
 * ------------------------------------------------------------------------- */

/**
 * Insert one row, or many when `body` is an array.
 * @returns The inserted row (with generated id/timestamps), or rows for bulk.
 */
export function create<T extends SQLiteTable>(args: {
  table: T;
  body: NewRow<T>;
  tx?: Executor;
}): Promise<Row<T>>;

export function create<T extends SQLiteTable>(args: {
  table: T;
  body: NewRow<T>[];
  tx?: Executor;
}): Promise<Row<T>[]>;

export async function create<T extends SQLiteTable>({
  table,
  body,
  tx = db,
}: {
  table: T;
  body: NewRow<T> | NewRow<T>[];
  tx?: Executor;
}) {
  const rows = (await tx
    .insert(table)
    .values(body as any)
    .returning()) as Row<T>[];

  return Array.isArray(body) ? rows : rows[0];
}

/* ----------------------------------------------------------------------------
 * Read
 * ------------------------------------------------------------------------- */

/**
 * Find a single row matching `where`.
 * @returns The row, or `undefined` when nothing matches.
 */
export const findOne = async <T extends SQLiteTable>({
  table,
  where,
  orderBy,
  tx = db,
}: {
  table: T;
  where?: SQL;
  orderBy?: OrderBy;
  tx?: Executor;
}): Promise<Row<T> | undefined> => {
  let query = tx.select().from(table).where(where).$dynamic();
  if (orderBy) query = query.orderBy(...toArray(orderBy));

  const [row] = (await query.limit(1)) as Row<T>[];
  return row;
};

/**
 * Find a row by its primary key `id`.
 * @returns The row, or `undefined` when no row has that id.
 */
export const findById = async <T extends TableWithId>({
  table,
  id,
  tx = db,
}: {
  table: T;
  id: number;
  tx?: Executor;
}): Promise<Row<T> | undefined> =>
  findOne({ table, where: eq(table.id, id), tx });

/**
 * Paginated find. Returns the page of rows plus the total count for `where`.
 */
export const findAll = async <T extends SQLiteTable>({
  table,
  where,
  orderBy,
  limit,
  offset,
  tx = db,
}: {
  table: T;
  where?: SQL;
  orderBy?: OrderBy;
  limit?: number;
  offset?: number;
  tx?: Executor;
}): Promise<{ rows: Row<T>[]; count: number }> => {
  let query = tx.select().from(table).where(where).$dynamic();
  if (orderBy) query = query.orderBy(...toArray(orderBy));
  if (limit !== undefined) query = query.limit(limit);
  if (offset !== undefined) query = query.offset(offset);

  const [rows, total] = await Promise.all([
    query as unknown as Promise<Row<T>[]>,
    count({ table, where, tx }),
  ]);
  return { rows, count: total };
};

/**
 * Find all matching rows without running a count query.
 */
export const findAllWithoutPagination = async <T extends SQLiteTable>({
  table,
  where,
  orderBy,
  limit,
  tx = db,
}: {
  table: T;
  where?: SQL;
  orderBy?: OrderBy;
  limit?: number;
  tx?: Executor;
}): Promise<Row<T>[]> => {
  let query = tx.select().from(table).where(where).$dynamic();
  if (orderBy) query = query.orderBy(...toArray(orderBy));
  if (limit !== undefined) query = query.limit(limit);

  return (await query) as Row<T>[];
};

/**
 * Count rows matching `where` (all rows when omitted).
 */
export const count = async <T extends SQLiteTable>({
  table,
  where,
  tx = db,
}: {
  table: T;
  where?: SQL;
  tx?: Executor;
}): Promise<number> => tx.$count(table, where);

/**
 * Existence check by id and/or condition.
 */
export const exists = async <T extends TableWithId>({
  table,
  id,
  where,
  tx = db,
}: {
  table: T;
  id?: number;
  where?: SQL;
  tx?: Executor;
}): Promise<boolean> => {
  const idFilter = id !== undefined ? eq(table.id, id) : undefined;
  const filter = idFilter && where ? and(idFilter, where) : (idFilter ?? where);
  return (await findOne({ table, where: filter, tx })) !== undefined;
};

/* ----------------------------------------------------------------------------
 * Update
 * ------------------------------------------------------------------------- */

/**
 * Update every row matching `where`.
 * Unlike Mongo's `findOneAndUpdate`, SQL UPDATE has no "single" mode: a loose
 * `where` updates every match. Filter by id when you mean one row.
 * @returns The updated rows (empty array when nothing matched).
 */
export const update = async <T extends SQLiteTable>({
  table,
  where,
  data,
  tx = db,
}: {
  table: T;
  where: SQL;
  data: SQLiteUpdateSetSource<T>;
  tx?: Executor;
}): Promise<Row<T>[]> =>
  (await tx.update(table).set(data).where(where).returning()) as Row<T>[];

/* ----------------------------------------------------------------------------
 * Delete
 * ------------------------------------------------------------------------- */

/**
 * Permanently delete every row matching `where`. (`delete` is a reserved
 * word, so it can't be an export name.)
 * There is no soft delete: the schema has no `deletedAt` column.
 * @returns The deleted rows (empty array when nothing matched).
 */
export const hardDelete = async <T extends SQLiteTable>({
  table,
  where,
  tx = db,
}: {
  table: T;
  where: SQL;
  tx?: Executor;
}): Promise<Row<T>[]> =>
  (await tx.delete(table).where(where).returning()) as Row<T>[];

/* ----------------------------------------------------------------------------
 * Bulk write
 * ------------------------------------------------------------------------- */

export type BulkOperation<T extends SQLiteTable> =
  | { insert: { body: NewRow<T> | NewRow<T>[] } }
  | { update: { where: SQL; data: SQLiteUpdateSetSource<T> } }
  | { delete: { where: SQL } };

/**
 * Run a list of insert/update/delete operations against one table, all inside
 * a single transaction: either every operation commits, or none do.
 * (Mongo's `ordered: false` "keep going on failure" has no equivalent here.)
 * @returns How many rows each kind of operation touched.
 */
export const bulkWrite = <T extends SQLiteTable>({
  table,
  operations,
}: {
  table: T;
  operations: BulkOperation<T>[];
}): { inserted: number; updated: number; deleted: number } =>
  db.transaction((tx) => {
    const result = { inserted: 0, updated: 0, deleted: 0 };

    for (const op of operations) {
      if ("insert" in op) {
        result.inserted += tx
          .insert(table)
          .values(op.insert.body as any)
          .run().changes;
      } else if ("update" in op) {
        result.updated += tx
          .update(table)
          .set(op.update.data)
          .where(op.update.where)
          .run().changes;
      } else {
        result.deleted += tx.delete(table).where(op.delete.where).run().changes;
      }
    }

    return result;
  });
