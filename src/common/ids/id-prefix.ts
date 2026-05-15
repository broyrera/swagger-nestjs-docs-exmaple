export const ID_PREFIX_BY_MODEL = {
  User: 'usr',
  Organization: 'org',
  OrganizationMember: 'om',
  Competition: 'cmp',
  CompetitionRoleAssignment: 'cra',
  Participant: 'par',
  Match: 'mat',
  BracketRound: 'br',
  BracketMatch: 'bm',
} as const;

export type ModelName = keyof typeof ID_PREFIX_BY_MODEL;
export type IdPrefix = (typeof ID_PREFIX_BY_MODEL)[ModelName];

export function isModelWithPrefix(model: string): model is ModelName {
  return model in ID_PREFIX_BY_MODEL;
}
