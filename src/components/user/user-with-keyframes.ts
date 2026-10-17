import { withKeyframes } from "../animated-mounting";
import { User } from "./user";
import classes from "./user-with-keyframes.module.css";

export const UserWithKeyframes = withKeyframes(
  User,
  classes.appear,
  classes.disappear,
);
