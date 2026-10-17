import { withTransitions } from "../../../animated";
import { Example } from "../../example";
import classes from "./with-transitions.module.css";

export const AnimatedExampleWithTransitions = withTransitions(
  Example,
  classes.invisible,
  classes.visible,
);
