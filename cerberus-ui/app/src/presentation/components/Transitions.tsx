import {SlideDirection} from "@cerberus/core";
import Slide from "@mui/material/Slide";
import {TransitionProps} from "@mui/material/transitions";
import {forwardRef} from "react";

export const SlideUp = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const SlideDown = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export const SlideLeft = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

export const SlideRight = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="right" ref={ref} {...props} />;
});

export const transitionSelector = (direction: SlideDirection) => {
  switch (direction) {
    case "up":
      return SlideUp;
    case "down":
      return SlideDown;
    case "left":
      return SlideLeft;
    case "right":
      return SlideRight;
  }
};
