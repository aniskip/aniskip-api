import { Rule } from 'src/relation-rules/relation-rules.types';

export class GetRelationRulesResponse {
  statusCode!: number;

  message!: string;

  found!: boolean;

  rules!: Rule[];
}
