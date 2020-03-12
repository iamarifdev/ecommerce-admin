import { IManufactureDetail } from './manufacture-detail.model';
import { IPricing } from './pricing.model';
import { IProductColor } from './product-color.model';

export interface IProductAdd {
  sku: string;
  title: string;
  description: string;
  manufactureDetail: IManufactureDetail;
  productColors: IProductColor[];
  pricing: IPricing;
  isEnabled: boolean;
}
