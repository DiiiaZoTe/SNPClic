export const getFakeSession = () => ({
  user: {
    email: "alexander.vencel.96@gmail.com",
    id: "",
    role: "user" as const,
    emailVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  session: {
    id: "",
    expiresAt: new Date(),
    fresh: true,
    userId: "",
  },
});