import ErrorStackParser from "error-stack-parser";
import { ERROR_STACK_MAX_LENGTH } from "../config";

export const getErrorStack = (error: unknown) => {
  try {
    if (!(error instanceof Error)) return [];
    const stack = ErrorStackParser.parse(error);
    if (stack.length > ERROR_STACK_MAX_LENGTH) {
      stack.length = ERROR_STACK_MAX_LENGTH;
    }
    return stack;
  } catch (error) {
    console.log('getErrorStack error', error);
    return [];
  }
};
