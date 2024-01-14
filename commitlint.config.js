// build: Changes that affect the build system or external dependencies.
// chore: Routine tasks or updates that don't modify src or test files.
// ci: Changes to your CI configuration files and scripts.
// docs: Documentation-only changes.
// feat: A new feature.
// fix: A bug fix.
// perf: A code change that improves performance.
// refactor: A code change that neither fixes a bug nor adds a feature.
// revert: Reverting a previous commit.
// style: Changes that do not affect the meaning of the code (e.g., formatting).
// test: Adding missing tests or correcting existing tests.
// translation: Changes related to internationalization and localization.
// security: Changes related to security.
// changeset: Changes related to versioning or release management.

module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "body-leading-blank": [1, "always"],
    "body-max-line-length": [2, "always", 100],
    "footer-leading-blank": [1, "always"],
    "footer-max-line-length": [2, "always", 100],
    "header-max-length": [2, "always", 100],
    "scope-case": [2, "always", "lower-case"],
    "subject-case": [
      2,
      "never",
      ["sentence-case", "start-case", "pascal-case", "upper-case"],
    ],
    "subject-empty": [2, "never"],
    "subject-full-stop": [2, "never", "."],
    "type-case": [2, "always", "lower-case"],
    "type-empty": [2, "never"],
    "type-enum": [
      2,
      "always",
      [
        "build",
        "chore",
        "ci",
        "docs",
        "feat",
        "fix",
        "perf",
        "refactor",
        "revert",
        "style",
        "test",
        "translation",
        "security",
        "changeset",
      ],
    ],
  },
};