# lib/db/queries

This folder contains database queries that can be used for trpc router or be called from server components.

It is useful for things like:
- for a protected route, once the user is verified, not having to call a trpc route which revalidates the user is logged in...