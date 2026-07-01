export type LinkedSurvivorStatus =
  | "PENDING"
  | "ACCEPTED"
  | "EXPIRED";

export type LinkedSurvivorRecord = {
  id: string;
  survivorId?: string;
  name: string;
  initials: string;
  avatarUrl?: string;
  age: number;
  conditionLabel: string;
  email: string;
  joinedAtLabel: string;
  linkedAtLabel?: string;
  status: LinkedSurvivorStatus;
};