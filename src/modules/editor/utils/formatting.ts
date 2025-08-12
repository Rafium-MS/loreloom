/**
 * Applies a rich text command using the browser's execCommand API.
 */
export const exec = (command: string, value?: string) => {
  document.execCommand(command, false, value);
};