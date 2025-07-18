export const useClamp = (target: number, min: number, max: number) => {
  return Math.min(Math.max(target, min), max);
};
