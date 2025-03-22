import { integer, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { CourseSectionTable } from "./courseSection";
import { relations } from "drizzle-orm";

export const lessonStatuses = ["public", "private", "preview"] as const;
export type lessonStatus = (typeof lessonStatuses)[number];
export const lessonStatusEnum = pgEnum("lesson_status", lessonStatuses);

export const LessonTable = pgTable("lessons", {
  id,
  name: text().notNull(),
  description: text(),
  youtubeVideoId: text().notNull(),
  status: lessonStatusEnum().notNull().default("private"),
  order: integer().notNull(),
  sectionId: uuid()
    .notNull()
    .references(() => CourseSectionTable.id, { onDelete: "cascade" }),
  createdAt,
  updatedAt,
});

export const LessonRelationships = relations(LessonTable, ({ one }) => ({
  course: one(CourseSectionTable, {
    fields: [LessonTable.sectionId],
    references: [CourseSectionTable.id],
  }),
}));
