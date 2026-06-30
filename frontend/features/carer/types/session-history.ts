export type RehabilitationSessionStatus =
  | "COMPLETED"
  | "PARTIAL"
  | "ENDED_EARLY"
  | "MISSED";

export type CarerSessionHistoryItem = {
  id: string;
  survivorId: string;
  dateLabel: string;
  dateISO: string;
  exerciseNames: string[];
  score: number | null;
  status: RehabilitationSessionStatus;
  durationMinutes: number | null;
};