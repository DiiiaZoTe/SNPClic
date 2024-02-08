// Use this file to run queries on the database using the drizzle-orm library.

import { db } from "./index";
import { forms } from "./schema";

import { FORM_DATA } from "@/app/questionnaire/content";

db.insert(forms).values({
  name: "Formulaire SNPClic",
  config: FORM_DATA,
}).then((result) => {
  console.log(result)
}).catch((error) => {
  console.error(error)
});