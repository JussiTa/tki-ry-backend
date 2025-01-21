export type SelectedNumbers = {
  value: number;
  label: string;
};
export type LotNumber = {
  lotNumber: number;
  unitPrice: number;
};

export type User = {
  firstName: string;
  lastName: string;
  address: string;
  postalCode: number;
  phoneNumber: string;
  lotNumber: SelectedNumbers[];
};

export type PaymentGroups = {
  id: string;
  name: string;
  svg: string;
};

export type ProviderPrameters = {
  name: string;
  value: string;
};

export type PaymentProviders = {
  url: string;
  icon: string;
  svg: string;
  name: string;
  group: string;
  id: string;
  parameters: ProviderPrameters[];
};

export type PaymentData = {
  providers: PaymentProviders[];
  groups: PaymentGroups[];
};
