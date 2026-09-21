/**
 * Tipos e contratos do domínio de Banners do Portal CSFA.
 */

export interface Banner {
  id: string | number;
  title: string;
  imageUrl: string;
  targetUrl: string;
  createdAt: string;
  publishDate: string;
  order: number;
  isActive: boolean;
}

export interface CreateBannerInput {
  title: string;
  imageUrl: string;
  targetUrl: string;
  publishDate?: string;
  order?: number;
  isActive: boolean;
}

export interface UpdateBannerInput extends Partial<CreateBannerInput> {
  id: string | number;
}

export interface BannerStats {
  total: number;
  active: number;
  inactive: number;
}
