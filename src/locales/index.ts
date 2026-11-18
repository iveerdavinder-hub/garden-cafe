import en from './en.json';

export const LOCALE = en;

export type LocaleSchema = typeof en;

/**
 * Replaces {{key}} placeholders in JSON locale strings with runtime values.
 */
export function formatText(
  template: string,
  variables: Record<string, string | number>
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) =>
    variables[key] !== undefined ? String(variables[key]) : ''
  );
}
