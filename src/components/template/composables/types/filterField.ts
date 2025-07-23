export interface FilterField {
  key: string;
  label: string;
  type: string;
  options?: { label: string; value: string }[]; // select용
}
