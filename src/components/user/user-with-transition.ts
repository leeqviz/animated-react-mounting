import { withTransition } from "../animated-mounting";
import { User } from "./user";
import classes from "./user-with-transition.module.css";

export const UserWithTransition = withTransition(
  User,
  classes.invisible,
  classes.visible,
);
