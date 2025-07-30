// Step enum
export enum ResStep {
  RES_PHONE = "res-phone",
  VERIFY_RES_OTP = "verify-res-otp",
  CONFIRM_RES_PASSWORD = "confirm-res-password",
}

// Ordered step array
export const resStepOrder: ResStep[] = [
  ResStep.RES_PHONE,
  ResStep.VERIFY_RES_OTP,
  ResStep.CONFIRM_RES_PASSWORD,
];

// Get next step
export function getNextStep(current: ResStep): ResStep | null {
  const index = resStepOrder.indexOf(current);
  return index >= 0 && index < resStepOrder.length - 1
    ? resStepOrder[index + 1]
    : null;
}

// Get previous step
export function getPreviousStep(current: ResStep): ResStep | null {
  const index = resStepOrder.indexOf(current);
  return index > 0 ? resStepOrder[index - 1] : null;
}
// Check if current step is first
export function isFirstStep(current: ResStep): boolean {
  return resStepOrder[0] === current;
}

// Check if current step is last

export function isLastStep(current: ResStep): boolean {
  return resStepOrder[resStepOrder.length - 1] === current;
}

export function getStepProgress(current: ResStep): number {
  const index = resStepOrder.indexOf(current);
  return index >= 0 ? (index + 1) / resStepOrder.length : 0;
}
