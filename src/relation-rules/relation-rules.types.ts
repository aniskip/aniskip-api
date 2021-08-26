export type Range = {
  start: number;
  end?: number;
};

export type Rule = {
  from: Range;
  to: { mal_id: number } & Range;
};

export type SectionType = 'meta' | 'rules' | 'unknown';
