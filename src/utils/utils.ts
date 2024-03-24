import { DELAY_IN_MS } from "../constants/delays";

export const delay = () => {
  return new Promise<NodeJS.Timeout>((resolve) => setTimeout(resolve, DELAY_IN_MS));
};
