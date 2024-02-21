import { CSSProperties } from 'react';

export const rootStyle = `
:root {
  --primary: #10a847;
  --background: #ffffff;
  --foreground: #262626;
  --destructive: #e60000;
  --muted: #767676;
  --very-light: #fdfdfd;
  --light: #ececec;

  --size-1: 0.25rem;
  --size-2: 0.5rem;
  --size-3: 0.75rem;
  --size-4: 1rem;
  --size-8: 2rem;
  --size-16: 4rem;

  --font-size-sm: 0.875rem;
  --font-size-sm-line-height: 1.25rem;
  --font-size-base: 1rem;
  --font-size-base-line-height: 1.50rem;
  --font-size-lg: 1.25rem;
  --font-size-lg-line-height: 1.65rem;
  --font-size-xl: 1.5rem;
  --font-size-xl-line-height: 1.75rem;
  --font-size-4xl: 2.25rem;
  --font-size-4xl-line-height: 2.5rem;

  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}

@page {
  margin: 1.5cm;
}

* {
  font-family: sans-serif;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-normal);
}
`;

export const html: CSSProperties = {
  WebkitPrintColorAdjust: "exact",
};

export const body: CSSProperties = {
  color: "var(--foreground)",
  backgroundColor: "var(--background)",
  display: "flex",
  flexDirection: "column",
  gap: "var(--size-8)",
  fontSize: "var(--font-size-base)",
};

export const header: CSSProperties = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "var(--size-4)",
};

export const ul: CSSProperties = {
  listStyle: "disc",
  listStylePosition: "inside",
  marginLeft: "var(--size-2)",
};

export const li: CSSProperties = {
  fontSize: "var(--font-size-sm)",
};

export const logo: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "var(--size-4)",
};

export const logoH1: CSSProperties = {
  color: "var(--primary)",
  fontSize: "var(--font-size-4xl)",
  fontWeight: "700",
  letterSpacing: "-0.025em",
};

export const logoSpan: CSSProperties = {
  fontSize: "var(--font-size-4xl)",
  color: "var(--foreground)",
  fontWeight: "700",
};

export const logomark: CSSProperties = {
  width: "var(--size-8)",
  height: "var(--size-8)",
};

export const logomarkPath1: CSSProperties = {
  fill: "var(--primary)",
};

export const logomarkPath2: CSSProperties = {
  fill: "var(--foreground)",
};

export const stepSection: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--size-4)",
};

export const step: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--size-2)",
};

export const stepHeader: CSSProperties = {
  display: "flex",
  flexDirection: "row",
  gap: "var(--size-4)",
  justifyContent: "space-between",
  alignItems: "center",
};

export const stepLabel: CSSProperties = {
  fontWeight: "var(--font-semibold)",
  fontSize: "var(--font-size-base)",
};

export const question: CSSProperties = {
  padding: "var(--size-2)",
  borderRadius: "var(--size-1)",
  border: "0.5px solid var(--light)",
  backgroundColor: "var(--very-light)",
  color: "var(--muted)",
};

export const questionCol: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--size-1)",
};

export const questionRow: CSSProperties = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "var(--size-4)",
};

export const questionHeader: CSSProperties = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "var(--size-4)",
  width: "100%",
};

export const questionLabel: CSSProperties = {
  fontWeight: "var(--font-medium)",
  fontSize: "var(--font-size-base)",
  color: "var(--foreground)",
};

export const bodyAnswer: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--size-1)",
};

export const bodyAnswerSpan: CSSProperties = {
  fontWeight: "var(--font-medium)",
};

export const stopReason: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--size-2)",
};

export const stopReasonP: CSSProperties = {
  fontWeight: "var(--font-medium)",
  padding: "var(--size-2)",
  borderRadius: "var(--size-1)",
  backgroundColor: "var(--light)",
  color: "var(--foreground)",
};

export const skipped: CSSProperties = {
  padding: "var(--size-1)",
  borderRadius: "var(--size-1)",
  backgroundColor: "var(--light)",
  color: "var(--foreground)",
  fontSize: "var(--font-size-sm)",
};

export const rowAlignCenter: CSSProperties = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "var(--size-2)",
};