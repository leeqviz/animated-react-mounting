import { withTransitions } from "../../animated-mounting";
import { Example } from "../example";
import classes from "./example-with-transitions.module.css";

export const ExampleWithTransitions = withTransitions(
  Example,
  classes.invisible,
  classes.visible,
);
