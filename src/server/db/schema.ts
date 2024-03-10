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
  int,
  datetime,
} from "drizzle-orm/mysql-core";

//* Rational on the schema:
// - id columns are unsigned bigint autoincrement
// - we don't expose the id column, instead we add a varchar(36) uuid column (uuid)

// User table
export const user = mysqlTable(
  "user",
  {
    id: varchar("id", { length: 21 }).primaryKey(),
    email: varchar("email", { length: 255 }).unique().notNull(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    hashedPassword: varchar("hashed_password", { length: 255 }),
    // avatar: varchar("avatar", { length: 255 }),
    role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
  (table) => ({
    emailIx: index("email_ix").on(table.email),
  }),
);

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;

// Session table
export const session = mysqlTable(
  "session",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    userId: varchar("user_id", { length: 21 }).notNull().references(() => user.id, { onDelete: "cascade" }),
    expiresAt: datetime("expires_at").notNull(),
  },
  (table) => ({
    userIx: index("user_ix").on(table.userId),
  }),
);

export type Session = typeof session.$inferSelect;

// Email verification code table
export const emailVerificationCode = mysqlTable(
  "email_verification_code",
  {
    id: int("id").primaryKey().autoincrement(),
    userId: varchar("user_id", { length: 21 }).unique().notNull().references(() => user.id, { onDelete: "cascade" }),
    email: varchar("email", { length: 255 }).notNull(),
    code: varchar("code", { length: 8 }).notNull(),
    expiresAt: datetime("expires_at").notNull(),
  },
  (table) => ({
    userIx: index("user_ix").on(table.userId),
    emailIx: index("email_ix").on(table.email),
  }),
);

// Password reset token table
export const passwordResetToken = mysqlTable(
  "password_reset_token",
  {
    id: varchar("id", { length: 40 }).primaryKey(),
    userId: varchar("user_id", { length: 21 }).notNull().references(() => user.id, { onDelete: "cascade" }),
    expiresAt: datetime("expires_at").notNull(),
  },
  (table) => ({
    userIx: index("user_ix").on(table.expiresAt),
  }),
);

// Form table
export const form = mysqlTable("form", {
  id: bigint("id", { mode: "bigint", unsigned: true }).primaryKey().autoincrement(),
  uuid: varchar('uuid', { length: 36 }).notNull(),
  name: text("name").notNull(),
  config: json("config").notNull(),
  createdAt: timestamp("submitted_at").notNull().defaultNow(),
  // Add other fields as necessary
  // creator
  // version 
  // is_open 
  // closing_time
}, (table) => ({
  uuidIx: uniqueIndex("uuid_ix").on(table.uuid),
}));

// Form Submission table
export const formSubmission = mysqlTable("form_submission", {
  id: bigint("id", { mode: "bigint", unsigned: true }).primaryKey().autoincrement(),
  uuid: varchar('uuid', { length: 36 }).notNull(),
  formId: bigint("form_id", { mode: "bigint", unsigned: true }).references(() => form.id, { onDelete: "set null", onUpdate: "cascade" }),
  submittedBy: varchar('submitted_by', { length: 21 }).references(() => user.id, { onDelete: "set null", onUpdate: "cascade" }),
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
  stopReason: text("stop_reason"),
  stopReasonQuestionId: varchar('stop_reason_question_id', { length: 36 }),
  skippedSteps: json("skipped_steps").$type<number[]>().notNull().default([]),
}, (table) => ({
  uuidIx: uniqueIndex("uuid_ix").on(table.uuid),
  submissionByIx: index("submitted_by_ix").on(table.submittedBy),
}));



// Submission Answer table
export const submissionAnswer = mysqlTable("submission_answer", {
  id: bigint("id", { mode: "bigint", unsigned: true }).primaryKey().autoincrement(),
  submissionId: bigint("submission_id", { mode: "bigint", unsigned: true }).notNull().references(() => formSubmission.id, { onDelete: "cascade", onUpdate: "cascade" }),
  questionId: varchar('question_id', { length: 36 }).notNull(),
  answerType: mysqlEnum("answer_type", ["boolean", "string", "string_array"]).notNull(),
  booleanAnswer: boolean("boolean_answer"),
  stringAnswer: text("string_answer"),
  skipped: boolean("skipped").default(false),
}, (table) => ({
  submissionIdIx: index("submission_id_ix").on(table.submissionId)
}));

// Submission Answer String Array table
export const submissionAnswerStringArray = mysqlTable("submission_answer_string_array", {
  id: bigint("id", { mode: "bigint", unsigned: true }).primaryKey().autoincrement(),
  answerId: bigint("answer_id", { mode: "bigint", unsigned: true }).notNull().references(() => submissionAnswer.id, { onDelete: "cascade", onUpdate: "cascade" }),
  // value string from "1" to "999999". Each question with value/label will have value from 1 to 999999 -> 999999 possible values
  // we may eventually change this to a uuid for infinite values
  value: varchar('value', { length: 6 }).notNull()
}, (table) => ({
  answerIdIx: index("answer_id_ix").on(table.answerId),
}));