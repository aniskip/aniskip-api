export type Range = {
  start: number;
  end?: number;
};

export type Rule = {
  from: Range;
  to: { malId: number } & Range;
};

export type SectionType = 'meta' | 'rules' | 'unknown';
