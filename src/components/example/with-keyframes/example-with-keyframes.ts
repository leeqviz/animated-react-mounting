import { withKeyframes } from "../../animated-mounting";
import { Example } from "../example";
import classes from "./example-with-keyframes.module.css";

export const ExampleWithKeyframes = withKeyframes(
  Example,
  classes.appear,
  classes.disappear,
);
