export interface HeroSummary {
  id: number;
  name: string;
  localizedName: string;
  shortName: string;
  primaryAttr: "str" | "agi" | "int";
  attackType: "Melee" | "Ranged";
  roles: string[];
  positions: string[];
  complexity?: number;
  image: string;
  icon: string;
}

export interface HeroDetail extends HeroSummary {
  baseHealth?: number;
  baseMana?: number;
  baseArmor?: number;
  baseAttackMin?: number;
  baseAttackMax?: number;
  baseStr?: number;
  baseAgi?: number;
  baseInt?: number;
  moveSpeed?: number;
  attackRange?: number;
  turnRate?: number;
  abilities?: Ability[];
  talents?: Talent[];
  description?: string;
}

export interface Ability {
  name: string;
  description?: string;
  cooldown?: number[];
  manaCost?: number[];
}

export interface Talent {
  name: string;
  description?: string;
}
