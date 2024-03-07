// Use this file to run queries on the database using the drizzle-orm library.

import { sql, eq, inArray } from "drizzle-orm";
import { db } from "./index";
import { form, formSubmission, submissionAnswer, submissionAnswerStringArray } from "./schema";
import { generateUUID } from "@/lib/utilities/uuid";
// import { insertNewAccount } from "@/server/auth/utilities";

// * Insert form data
// import { FORM_DATA } from "@/app/(app)/(protected)/questionnaire/content";
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
// db.select().from(formSubmission).where(eq(formSubmission.uuid, submissionUUID))
//   .then((submissionData) => {
//     const submissionID = submissionData[0]?.id;
//     const formID = submissionData[0]?.form_id;
//     if (!submissionID || !formID) throw new Error("No form submission found");
//     console.log(submissionData)
//     db.select().from(submissionAnswer)
//       .where(eq(submissionAnswer.submission_id, submissionID))
//       .then((answersData) => {
//         console.log(answersData)
//         const stringArrayAnswersID = answersData.filter((answer) => answer.answer_type === "string_array").map((answer) => answer.id);
//         db.select().from(submissionAnswerStringArray)
//           .where(inArray(submissionAnswerStringArray.answer_id, stringArrayAnswersID))
//           .then((stringArrayAnswersData) => {
//             console.log(stringArrayAnswersData)
//         })
//       })
//   })

// insertNewAccount("alex.vencel.96@gmail.com", "Test1234")
//   .then((result) => {
//     console.log(result)
//   })
//   .catch((error) => {
//     console.error(error)
//   });
