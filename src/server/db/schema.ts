import {
  bigint,
  mysqlTable,
  text,
  json,
  timestamp,
  boolean,
  varchar,
  mysqlEnum,
  uniqueIndex,
  index,
} from "drizzle-orm/mysql-core";

//* Rational on the schema:
// - id columns are unsigned bigint autoincrement
// - we don't expose the id column, instead we add a varchar(36) uuid column (uuid)

// Form table
export const form = mysqlTable("form", {
  id: bigint("id", { mode: "bigint", unsigned: true }).primaryKey().autoincrement(),
  uuid: varchar('uuid', { length: 36 }).notNull(),
  name: text("name").notNull(),
  config: json("config").notNull(),
  created_at: timestamp("submitted_at").notNull().defaultNow(),
  // Add other fields as necessary
  // creator
  // version 
  // is_open 
  // closing_time
}, (table) => ({
  uuid_ix: uniqueIndex("uuid_ix").on(table.uuid),
})
);

// Form Submission table
export const form_submission = mysqlTable("form_submission", {
  id: bigint("id", { mode: "bigint", unsigned: true }).primaryKey().autoincrement(),
  uuid: varchar('uuid', { length: 36 }).notNull(),
  form_id: bigint("form_id", { mode: "bigint", unsigned: true }).references(() => form.id, { onDelete: "set null", onUpdate: "cascade" }),
  submitted_at: timestamp("submitted_at").notNull().defaultNow(),
  stop_reason: text("stop_reason"),
  stop_reason_question_id: varchar('stop_reason_question_key', { length: 36 }),
}, (table) => ({
  uuid_ix: uniqueIndex("uuid_ix").on(table.uuid),
})
);

// Form Answer table
export const submission_answer = mysqlTable("submission_answer", {
  id: bigint("id", { mode: "bigint", unsigned: true }).primaryKey().autoincrement(),
  submission_id: bigint("submission_id", { mode: "bigint", unsigned: true }).notNull().references(() => form_submission.id, { onDelete: "cascade", onUpdate: "cascade" }),
  question_id: varchar('question_id', { length: 36 }).notNull(),
  answer_type: mysqlEnum("answer_type", ["boolean", "string", "string_array"]).notNull(),
  boolean_answer: boolean("boolean_answer"),
  string_answer: text("string_answer"),
  skipped: boolean("skipped").default(false),
});

// Form Answer String Array table
export const submission_answer_string_array = mysqlTable("submission_answer_string_array", {
  id: bigint("id", { mode: "bigint", unsigned: true }).primaryKey().autoincrement(),
  answer_id: bigint("answer_id", { mode: "bigint", unsigned: true }).notNull().references(() => submission_answer.id, { onDelete: "cascade", onUpdate: "cascade" }),
  // value string from "1" to "999999". Each question with value/label will have value from 1 to 999999 -> 999999 possible values
  // we may eventually change this to a uuid for infinite values
  value: varchar('value', { length: 6 }).notNull()

}, (table) => ({
  answer_id_ix: index("answer_id_ix").on(table.answer_id),
})
);