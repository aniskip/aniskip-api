import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { Rule, SectionType } from './relation-rules.types';

@Injectable()
export class RelationRulesService {
  rules: Record<number, Rule[]>;

  version: string;

  lastModified: Date;

  constructor() {
    this.rules = {};
    this.version = '';
    this.lastModified = new Date();

    this.readRelations();
  }

  /**
   * Read and parse anime-relations rules.
   */
  readRelations(): void {
    const animeRelationsFilePath = path.join(
      __dirname,
      '..',
      '..',
      'deps',
      'anime-relations',
      'anime-relations.txt'
    );

    const animeRelations = fs.readFileSync(animeRelationsFilePath, 'utf-8');

    let section: SectionType = 'unknown';
    animeRelations.split('\n').forEach((line) => {
      if (line.startsWith('#') || line === '') {
        return;
      }

      if (line.startsWith('::meta')) {
        section = 'meta';
      } else if (line.startsWith('::rules')) {
        section = 'rules';
      }

      switch (section) {
        case 'meta': {
          const matches = line.match(/([a-z_]+): ([0-9.-]+)/);
          if (!matches) {
            break;
          }

          const label = matches[1];
          const value = matches[2];
          switch (label) {
            case 'version':
              this.version = value;
              break;
            case 'last_modified':
              this.lastModified = new Date(value);
              break;
            default:
          }
          break;
        }
        case 'rules':
          this.parseRule(line.replace('- ', ''));
          break;
        default:
      }
    });
  }

  /**
   * Parses a rule and adds it the rules table.
   *
   * @param ruleString Rule as a string to parse.
   */
  parseRule(ruleString: string): void {
    const idsPattern = /(\d+|[?~])\|(\d+|[?~])\|(\d+|[?~])/;
    const episodePattern = /(\d+|[?])(?:-(\d+|[?]))?/;
    const rulePattern = new RegExp(
      `${idsPattern.source}:${episodePattern.source} -> ${idsPattern.source}:${episodePattern.source}(!)?`
    );

    const matches = ruleString.match(rulePattern);
    if (!matches) {
      return;
    }

    const getRange = (
      firstIndex: number,
      secondIndex: number
    ): { start: number; end?: number } => {
      const start = parseInt(matches[firstIndex], 10);
      let end: number | null;

      if (matches[secondIndex]) {
        if (matches[secondIndex] === '?') {
          // Unknown range end (airing series).
          end = null;
        } else {
          end = parseInt(matches[secondIndex], 10);
        }
      } else {
        // Singular episode.
        end = start;
      }

      return { start, ...(end !== null && { end }) };
    };

    const fromMalId = parseInt(matches[1], 10);
    if (!fromMalId) {
      return;
    }

    let rules = this.rules[fromMalId] || [];
    const toMalId = matches[6] === '~' ? fromMalId : parseInt(matches[6], 10);
    const from = getRange(4, 5);
    const toRange = getRange(9, 10);
    const to = { mal_id: toMalId, ...toRange };
    const rule = { from, to };
    rules.push(rule);
    this.rules[fromMalId] = rules;

    if (matches[11] === '!') {
      rules = this.rules[toMalId] || [];
      rules.push(rule);
      this.rules[toMalId] = rules;
    }
  }

  /**
   * Get the rules for the given MAL id.
   *
   * @param animeId MAL id of the anime to retrieve the rules of.
   */
  getRule(animeId: number): Rule[] {
    return this.rules[animeId] || [];
  }
}
