type ContentfulMetadata = {
  tags: any[];
  concepts: any[];
};

type SystemProperties = {
  type: string;
  linkType: string;
  id: string;
};
type SystemDescription = {
  id: string;
  type: string;
  revision: string;
  locale: string;
  createdAt: Date;
  updatedAt: Date;
  publishedVersion: number;
  space: { sys: SystemProperties };
  environment: { sys: SystemProperties };
  contentType: { sys: SystemProperties };
};

export type ProductFields = {
  sku: string;
  name: string;
  brand: string;
  model: string;
  category: string;
  color: string;
  price: number;
  currency: string;
  stock: number;
};
export type ItemWrapper = {
  metadata: ContentfulMetadata;
  sys: SystemDescription;
  fields: ProductFields;
};

export type ResponseWrapper = {
  sys: { type: string };
  total: number;
  skip: number;
  limit: number;
  items: ItemWrapper[];
};

type ProductInternalFields = {
  externalId: string;
  externalCreatedAt: Date;
  externalUpdatedAt: Date;
  isVisible: boolean;
};

export type ConvertedProduct = ProductFields & ProductInternalFields;
