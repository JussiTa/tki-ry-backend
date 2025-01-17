export type SelectedNumbers = {
  value: number;
  label: string;
};

export type User = {
  firstName: string;
  lastName: string;
  address: string;
  postalCode: number;
  phoneNumber: string;
  lotNumber: SelectedNumbers[];
};
