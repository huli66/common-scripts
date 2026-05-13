import ErrorStackParser from "error-stack-parser";
import { ERROR_STACK_MAX_LENGTH } from "../config";

export const getErrorStack = (error: Error) => {
  try {
    const stack = ErrorStackParser.parse(error);
    if (stack.length > ERROR_STACK_MAX_LENGTH) {
      stack.length = ERROR_STACK_MAX_LENGTH;
    }
    return stack;
  } catch (error) {
    console.error('getErrorStack error', error);
    return [];
  }
};
