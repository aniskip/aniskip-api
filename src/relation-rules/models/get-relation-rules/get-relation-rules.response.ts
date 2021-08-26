import { Rule } from 'src/relation-rules/relation-rules.types';

export class GetRelationRulesResponse {
  status_code!: number;

  message!: string;

  found!: boolean;

  rules!: Rule[];
}
