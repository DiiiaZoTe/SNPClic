// Use this file to run queries on the database using the drizzle-orm library.

import { sql, eq } from "drizzle-orm";
import { db } from "./index";
import { form, form_submission, submission_answer, submission_answer_string_array } from "./schema";
import { generateUUID } from "@/lib/uuid";

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
const submissionUUID = "3eb754b0-6aba-4ea9-abdf-5d99423be9bb";
db.select().from(form_submission).where(eq(form_submission.uuid, submissionUUID))
  .then((submissionData) => {
    const submissionID = submissionData[0]?.id;
    const formID = submissionData[0]?.form_id;
    if (!submissionID || !formID) throw new Error("No form submission found");
    console.log(submissionData)
    db.select().from(submission_answer)
      .leftJoin(submission_answer_string_array, eq(submission_answer.id, submission_answer_string_array.answer_id))
      .where(eq(submission_answer.submission_id, submissionID))
      .then((answersData) => {
        console.log(answersData)
      })
  })