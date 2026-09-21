/**
 * Tipos e contratos do domínio de Postagens (Posts).
 * Alinhado com os modelos do Backend Prisma (`api-csfa`) e fluxo editorial institucional.
 */

export type PostStatus = "DRAFT" | "PENDING_REVIEW" | "PUBLISHED" | "RETURNED" | "ARCHIVED" | "Publicado" | "Rascunho";

export interface PostAuthor {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  imageUrl?: string;
}

export interface Post {
  id: string;
  title: string;
  content?: string;
  slug?: string;
  excerpt?: string | null;
  coverImageId?: string | null;
  isEvent?: boolean | null;
  author: string;
  authorId?: string;
  authorObj?: PostAuthor;
  date: string; // formato exibível ex: "10/09/2026"
  status: PostStatus;
  published: boolean;
  views: string | number;
  category: string;
  reviewNotes?: string | null;
  reviewedById?: string | null;
  reviewedBy?: PostAuthor | null;
  reviewedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string | null;
  tags?: Array<{ tag: { id: string; name: string; slug: string; color?: string } }>;
}

export interface CreatePostDTO {
  title: string;
  content: string;
  slug?: string;
  excerpt?: string;
  category?: string;
  coverImageId?: string;
  published?: boolean;
  isEvent?: boolean;
}

export interface UpdatePostDTO {
  title?: string;
  content?: string;
  excerpt?: string;
  category?: string;
  coverImageId?: string;
  published?: boolean;
}

export type PostFilterStatus = "all" | "published" | "draft" | "pending_review" | "returned";

export interface PostFiltersState {
  searchQuery: string;
  status: PostFilterStatus;
  currentPage: number;
  itemsPerPage: number;
}

export interface PostStats {
  total: number;
  published: number;
  draft: number;
  pendingReview?: number;
  returned?: number;
}
