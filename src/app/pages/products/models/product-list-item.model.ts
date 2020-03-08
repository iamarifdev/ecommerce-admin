import { IManufactureDetail } from './manufacture-detail.model';
import { IPricing } from './pricing.model';
import { IProductColor } from './product-color.model';

export interface IProductListItem {
  id: string;
  sku: string;
  title: string;
  description: string;
  manufactureDetail: IManufactureDetail;
  pricing: IPricing;
  productColors: IProductColor[];
  featureImageUrl: string;
  createdAt: Date;
  updatedAt: Date;
  isEnabled: boolean;
}
