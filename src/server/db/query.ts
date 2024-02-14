// Use this file to run queries on the database using the drizzle-orm library.

import { sql } from "drizzle-orm";
import { db } from "./index";
import { form } from "./schema";
import { generateUUID } from "@/lib/uuid";

import { FORM_DATA } from "@/app/questionnaire/content";
db.insert(form).values({
  uuid: generateUUID(),
  name: "Questionnaire SNPClic",
  config: FORM_DATA.config,
}).then((result) => {
  console.log(result)
}).catch((error) => {
  console.error(error)
});

// db.select({ config: forms.config }).from(forms).where(sql`${forms.id} = 1`).then((result) => {
//   console.log(JSON.stringify(result[0]?.config, null, 2))
// }).catch((error) => {
//   console.error(error)
// });