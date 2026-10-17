import { withTransition } from "../../animated-mounting";
import { Example } from "../example";
import classes from "./example-with-transition.module.css";

export const ExampleWithTransition = withTransition(
  Example,
  classes.invisible,
  classes.visible,
);
