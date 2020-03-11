import { IManufactureDetail } from './manufacture-detail.model';
import { IPricing } from './pricing.model';
import { IProductColor } from './product-color.model';

export interface IProduct {
  id: string;
  sku: string;
  title: string;
  description: string;
  manufactureDetail: IManufactureDetail;
  productColors: IProductColor[];
  pricing: IPricing;
  featureImageUrl: string;
  isEnabled: boolean;
}
