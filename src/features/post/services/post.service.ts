import { httpClient, type HttpClient } from "@/core/http";
import type { CreatePostDTO, Post, UpdatePostDTO } from "../types/post.types";

/**
 * Service de Domínio para Postagens.
 * Conectado 100% à API REST do Back-End CSFA com suporte ao fluxo editorial.
 */
export class PostService {
  private readonly client: HttpClient;

  constructor(client: HttpClient = httpClient) {
    this.client = client;
  }

  /**
   * Busca todas as postagens da API.
   */
  async getAll(): Promise<Post[]> {
    try {
      const response = await this.client.get<any>("/posts");
      const list = Array.isArray(response) ? response : response.data || [];
      if (Array.isArray(list)) {
        return list.map((p: any) => this.normalizePost(p));
      }
      return [];
    } catch (error) {
      console.error("Erro ao buscar postagens:", error);
      return [];
    }
  }

  /**
   * Busca postagens do usuário logado (Professor/Autor).
   */
  async getMyPosts(): Promise<Post[]> {
    try {
      const response = await this.client.get<any>("/posts/my-posts");
      const list = Array.isArray(response) ? response : response.data || [];
      if (Array.isArray(list)) {
        return list.map((p: any) => this.normalizePost(p));
      }
      return [];
    } catch (error) {
      console.error("Erro ao buscar meus posts:", error);
      return [];
    }
  }

  /**
   * Busca fila de revisão (Coordenação / Admin).
   */
  async getReviewQueue(): Promise<Post[]> {
    try {
      const response = await this.client.get<any>("/posts/review-queue");
      const list = Array.isArray(response) ? response : response.data || [];
      if (Array.isArray(list)) {
        return list.map((p: any) => this.normalizePost(p));
      }
      return [];
    } catch (error) {
      console.error("Erro ao buscar fila de revisão:", error);
      return [];
    }
  }

  /**
   * Busca uma postagem por ID ou slug.
   */
  async getById(id: string | number): Promise<Post> {
    const response = await this.client.get<any>(`/posts/${id}`);
    const item = response.data || response;
    if (!item) {
      throw new Error("Postagem não encontrada");
    }
    return this.normalizePost(item);
  }

  /**
   * Cria uma nova postagem.
   */
  async create(data: CreatePostDTO): Promise<Post> {
    const response = await this.client.post<any>("/posts", data);
    return this.normalizePost(response.data || response);
  }

  /**
   * Atualiza uma postagem existente.
   */
  async update(id: string | number, data: UpdatePostDTO): Promise<Post> {
    const response = await this.client.put<any>(`/posts/${id}`, data);
    return this.normalizePost(response.data || response);
  }

  /**
   * Submete post para revisão editorial.
   */
  async submitReview(id: string | number): Promise<Post> {
    const response = await this.client.post<any>(`/posts/${id}/submit-review`, {});
    return this.normalizePost(response.data || response);
  }

  /**
   * Aprova e publica um post (Coordenação / Admin).
   */
  async approve(id: string | number): Promise<Post> {
    const response = await this.client.post<any>(`/posts/${id}/approve`, {});
    return this.normalizePost(response.data || response);
  }

  /**
   * Devolve um post com observações (Coordenação / Admin).
   */
  async returnPost(id: string | number, reviewNotes: string): Promise<Post> {
    const response = await this.client.post<any>(`/posts/${id}/return`, { reviewNotes });
    return this.normalizePost(response.data || response);
  }

  /**
   * Exclui uma postagem.
   */
  async delete(id: string | number): Promise<void> {
    await this.client.delete(`/posts/${id}`);
  }

  /**
   * Alterna o status de publicação da postagem.
   */
  async toggleStatus(id: string | number): Promise<Post> {
    const response = await this.client.patch<any>(`/posts/${id}/publish`);
    return this.normalizePost(response.data || response);
  }

  /**
   * Normaliza dados vindos da API para o formato esperado pelo frontend.
   */
  private normalizePost(raw: any): Post {
    let authorName = "Redação CSFA";
    if (raw.author?.firstName) {
      authorName = `${raw.author.firstName} ${raw.author.lastName ?? ""}`.trim();
    } else if (typeof raw.author === "string") {
      authorName = raw.author;
    }

    return {
      id: String(raw.id),
      title: raw.title,
      content: raw.content,
      slug: raw.slug,
      excerpt: raw.excerpt,
      coverImageId: raw.coverImageId,
      author: authorName,
      authorId: raw.authorId,
      authorObj: raw.author,
      date: raw.createdAt ? new Date(raw.createdAt).toLocaleDateString("pt-BR") : new Date().toLocaleDateString("pt-BR"),
      status: raw.status || (raw.published ? "PUBLISHED" : "DRAFT"),
      published: Boolean(raw.published),
      views: raw.views ?? 0,
      category: raw.category || (raw.isEvent ? "Eventos" : "Institucional"),
      reviewNotes: raw.reviewNotes,
      reviewedById: raw.reviewedById,
      reviewedBy: raw.reviewedBy,
      reviewedAt: raw.reviewedAt,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      publishedAt: raw.publishedAt,
      tags: raw.tags,
    };
  }
}

export const postService = new PostService();
