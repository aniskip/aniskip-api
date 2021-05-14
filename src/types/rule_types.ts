export interface RangeType {
  start: number;
  end?: number;
}

export interface RuleType {
  from: RangeType;
  to: { malId: number } & RangeType;
}

export type SectionType = 'meta' | 'rules' | 'unknown';
