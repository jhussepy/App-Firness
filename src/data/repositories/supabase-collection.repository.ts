import { supabase } from '@/lib/supabase';
import type { Repository } from './repository.interface';

interface CollectionRow {
  item_id: string;
  data: unknown;
}

// Cloud-backed counterpart to createCollectionRepository (repository.interface.ts) —
// same Repository<T> shape, so stores don't need to change when swapping one
// for the other. All rows for every domain live in one `user_collections`
// table (see supabase/schema.sql), scoped by `collection` and protected by
// Row Level Security keyed on auth.uid(), so no explicit user_id filtering
// is needed here — Postgres enforces it server-side.
export function createSupabaseCollectionRepository<T extends { id: string }>(collection: string): Repository<T> {
  return {
    async getAll() {
      const { data, error } = await supabase.from('user_collections').select('data').eq('collection', collection);
      if (error) throw error;
      return ((data ?? []) as CollectionRow[]).map((row) => row.data as T);
    },
    async getById(id) {
      const { data, error } = await supabase
        .from('user_collections')
        .select('data')
        .eq('collection', collection)
        .eq('item_id', id)
        .maybeSingle();
      if (error) throw error;
      return (data?.data as T) ?? undefined;
    },
    async upsert(item) {
      const { error } = await supabase
        .from('user_collections')
        .upsert({ collection, item_id: item.id, data: item }, { onConflict: 'user_id,collection,item_id' });
      if (error) throw error;
      return item;
    },
    async upsertMany(items) {
      if (items.length === 0) return items;
      const rows = items.map((item) => ({ collection, item_id: item.id, data: item }));
      const { error } = await supabase
        .from('user_collections')
        .upsert(rows, { onConflict: 'user_id,collection,item_id' });
      if (error) throw error;
      return items;
    },
    async remove(id) {
      const { error } = await supabase
        .from('user_collections')
        .delete()
        .eq('collection', collection)
        .eq('item_id', id);
      if (error) throw error;
    },
  };
}
