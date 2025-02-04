export interface IAddress {
  id:number
  addressName?: string;
  cityCode?: number;
  city?: string;
  districtCode?: number;
  district?: string;
  communeCode?: number;
  commune?: string;
  isDefault?: boolean;
  customer?: any;
}
