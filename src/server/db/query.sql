WITH ParsedConfig AS(
  SELECT
    f.id AS form_id,
  JSON_UNQUOTE(JSON_EXTRACT(q.value, '$.id')) AS question_id,
  JSON_UNQUOTE(JSON_EXTRACT(q.value, '$.text')) AS question_text,
  JSON_UNQUOTE(JSON_EXTRACT(c.value, '$.name')) AS step_title-- Extract step title
  FROM
    form f,
  JSON_TABLE(f.config, '$[*]' COLUMNS(
    value JSON PATH '$',
    name VARCHAR(255) PATH '$.name', --Extract the "name" field as step_title
      questions JSON PATH '$.questions'
  )) c,
  JSON_TABLE(c.questions, '$[*]' COLUMNS(
    value JSON PATH '$'
  )) q
),
  AnsweredQuestions AS(
    SELECT
    fs.id AS submission_id,
    pc.question_text AS question_text,
    --Aggregate all answers into JSON objects
    CASE
      WHEN sa.boolean_answer IS NOT NULL THEN JSON_OBJECT(
      'type', 'boolean',
      'value', sa.boolean_answer
    )
      WHEN sa.string_answer IS NOT NULL THEN JSON_OBJECT(
      'type', 'string',
      'value', sa.string_answer
    )
      WHEN sasa.value IS NOT NULL THEN JSON_OBJECT(
      'type', 'string_array',
      'value', JSON_ARRAYAGG(sasa.value)
    )
      ELSE JSON_OBJECT(
      'type', 'unknown',
      'value', NULL
    )
    END AS answer
  FROM
    form_submission fs
  JOIN form f ON fs.form_id = f.id
  LEFT JOIN ParsedConfig pc ON f.id = pc.form_id
  LEFT JOIN submission_answer sa ON fs.id = sa.submission_id
  LEFT JOIN submission_answer_string_array sasa ON sa.id = sasa.answer_id
  GROUP BY
    fs.id, pc.question_text, sa.boolean_answer, sa.string_answer, sasa.value
  )
SELECT
fs.id AS submission_id,
  fs.uuid,
  fs.form_id,
  u.email AS submitted_by, --Replace with user email
fs.submitted_at,
  fs.stop_reason,
  (
    SELECT pc.question_text
    FROM ParsedConfig pc
    WHERE pc.form_id = fs.form_id AND pc.question_id = fs.stop_reason_question_id
    LIMIT 1
  ) AS stop_reason_question_text,
  aa.answers
FROM
  form_submission fs
LEFT JOIN
  (SELECT
      submission_id,
    JSON_OBJECTAGG(question_text, answer) AS answers
   FROM AnsweredQuestions
   GROUP BY submission_id) aa ON fs.id = aa.submission_id
LEFT JOIN user u ON fs.submitted_by = u.id; --Join user table to get email