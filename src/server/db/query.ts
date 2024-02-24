// Use this file to run queries on the database using the drizzle-orm library.

import { sql, eq, inArray } from "drizzle-orm";
import { db } from "./index";
import { form, form_submission, submission_answer, submission_answer_string_array } from "./schema";
import { generateUUID } from "@/lib/utilities/uuid";
import { api } from "@/trpc/server";

// * Insert form data
// import { FORM_DATA } from "@/app/questionnaire/content";
// db.insert(form).values({
//   uuid: generateUUID(),
//   name: "Questionnaire SNPClic",
//   config: FORM_DATA.config,
// }).then((result) => {
//   console.log(result)
// }).catch((error) => {
//   console.error(error)
// });

// * Select form data
// db.select({ config: forms.config }).from(forms).where(sql`${forms.id} = 1`).then((result) => {
//   console.log(JSON.stringify(result[0]?.config, null, 2))
// }).catch((error) => {
//   console.error(error)
// });

// * Get submission data
// const submissionUUID = "2c3e94b4-70a2-4042-b09b-a9d568d03f22";
// db.select().from(form_submission).where(eq(form_submission.uuid, submissionUUID))
//   .then((submissionData) => {
//     const submissionID = submissionData[0]?.id;
//     const formID = submissionData[0]?.form_id;
//     if (!submissionID || !formID) throw new Error("No form submission found");
//     console.log(submissionData)
//     db.select().from(submission_answer)
//       .where(eq(submission_answer.submission_id, submissionID))
//       .then((answersData) => {
//         console.log(answersData)
//         const stringArrayAnswersID = answersData.filter((answer) => answer.answer_type === "string_array").map((answer) => answer.id);
//         db.select().from(submission_answer_string_array)
//           .where(inArray(submission_answer_string_array.answer_id, stringArrayAnswersID))
//           .then((stringArrayAnswersData) => {
//             console.log(stringArrayAnswersData)
//         })
//       })
//   })
