import {
  bigint,
  mysqlTable,
  text,
  json,
  timestamp,
  boolean,
} from "drizzle-orm/mysql-core";

// Forms table
export const forms = mysqlTable("forms", {
  id: bigint("id", { mode: "bigint", unsigned: true }).primaryKey().autoincrement(),
  name: text("name").notNull(),
  config: json("config").notNull(),
  // Add other fields as necessary
  // creator 
  // created_at 
  // version 
  // is_open 
  // closing_time
});

// Form Submissions table
export const form_submissions = mysqlTable("form_submissions", {
  id: bigint("id", { mode: "bigint", unsigned: true }).primaryKey().autoincrement(),
  form_id: bigint("form_id", { mode: "bigint", unsigned: true }).notNull().references(() => forms.id),
  submitted_at: timestamp("submitted_at").defaultNow(),
  stop_reason: text("stop_reason"),
});

// Form Answers table
export const form_answers = mysqlTable("question_answers", {
  id: bigint("id", { mode: "bigint", unsigned: true }).primaryKey().autoincrement(),
  submission_id: bigint("submission_id", { mode: "bigint", unsigned: true }).notNull().references(() => form_submissions.id),
  question_id: text("question_id").notNull(),
  answer: text("answer"),
  skipped: boolean("skipped").default(false),
});