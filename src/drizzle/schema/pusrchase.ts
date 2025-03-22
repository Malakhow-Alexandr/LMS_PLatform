import {
  integer,
  jsonb,
  uuid,
  text,
  timestamp,
  pgTable,
} from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { relations } from "drizzle-orm";
import { UserTable } from "./user";
import { ProductTable } from "./product";

export const PurshaseTable = pgTable("purchases", {
  id,
  pricePaidInCents: integer().notNull(),
  productDetails: jsonb()
    .notNull()
    .$type<{ name: string; description: string; imageUrl: string }>(),
  userId: uuid()
    .notNull()
    .references(() => UserTable.id, { onDelete: "restrict" }),
  productId: uuid()
    .notNull()
    .references(() => ProductTable.id, { onDelete: "restrict" }),
  stripeSessionId: text().notNull().unique(),
  refundedAt: timestamp({ withTimezone: true }),
  createdAt,
  updatedAt,
});

export const PurshaseRelationships = relations(PurshaseTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [PurshaseTable.userId],
    references: [UserTable.id],
  }),
  product: one(ProductTable, {
    fields: [PurshaseTable.productId],
    references: [ProductTable.id],
  }),
}));
