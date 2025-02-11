import { defineDb, column, defineTable } from "astro:db";

const User = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    email: column.text({ unique: true }),
    password: column.text(),
    twoFactorSecret: column.text({ optional: true }),
  },
});

const Session = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    expiresAt: column.date(),
    userId: column.text({ references: () => User.columns.id }),
  },
});

export default defineDb({
  tables: {
    User,
    Session,
  },
});
