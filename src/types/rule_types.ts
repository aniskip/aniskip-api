export interface Range {
  start: number;
  end?: number;
}

export interface RuleType {
  from: Range;
  to: { malId: number } & Range;
}

export type SectionType = 'meta' | 'rules' | 'unknown';
