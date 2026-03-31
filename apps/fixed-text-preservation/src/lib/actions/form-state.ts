export interface FormActionState {
  message: string | null;
  fieldErrors?: Record<string, string[] | undefined>;
}

export const INITIAL_FORM_ACTION_STATE: FormActionState = {
  message: null,
  fieldErrors: {},
};
