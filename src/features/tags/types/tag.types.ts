/**
 * Tipos e contratos do domínio de Tags & Categorias CSFA.
 */

export interface TagItem {
  id: string | number;
  name: string;
  slug: string;
  color: string;
  description: string;
  usageCount: number;
  createdAt: string;
  isActive: boolean;
}

export interface CreateTagInput {
  name: string;
  slug?: string;
  color: string;
  description: string;
  isActive: boolean;
}

export interface TagStats {
  total: number;
  active: number;
  inactive: number;
  totalUsage: number;
}
