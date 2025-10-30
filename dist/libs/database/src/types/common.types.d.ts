import type { PrismaClient } from '.prisma/client';
export type Transaction = Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'>;
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
export interface PaginationParams {
    skip?: number;
    take?: number;
}
export interface PaginatedResult<T> {
    items: T[];
    total: number;
    hasMore: boolean;
}
