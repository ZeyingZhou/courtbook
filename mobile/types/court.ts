export type Court = Readonly<{
  id: string;
  name: string;
}>;

export type Facility = Readonly<{
  id: string;
  name: string;
  courts: readonly Court[];
}>;
