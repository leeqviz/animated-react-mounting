import { withKeyframes } from "../../../animated";
import { Example } from "../../example";
import classes from "./with-keyframes.module.css";

export const AnimatedExampleWithKeyframes = withKeyframes(
  Example,
  classes.appear,
  classes.disappear,
);
