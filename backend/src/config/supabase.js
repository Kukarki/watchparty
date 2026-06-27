import { createClient } from '@supabase/supabase-js';
import ws from 'ws';
import { config } from './index.js';
import { logger } from '../utils/logger.js';

let supabaseClient     = null;
let supabaseAdminClient = null;

export function getSupabase() {
  if (!config.supabase.url || !config.supabase.anonKey) return null;
  if (!supabaseClient) {
    supabaseClient = createClient(config.supabase.url, config.supabase.anonKey, {
      realtime: { transport: ws },
    });
  }
  return supabaseClient;
}

export function getSupabaseAdmin() {
  if (!config.supabase.url || !config.supabase.serviceKey) return null;
  if (!supabaseAdminClient) {
    supabaseAdminClient = createClient(
      config.supabase.url,
      config.supabase.serviceKey,
      { auth: { autoRefreshToken: false, persistSession: false }, realtime: { transport: ws } }
    );
  }
  return supabaseAdminClient;
}

export function isSupabaseConnected() {
  return !!(config.supabase.url && config.supabase.serviceKey);
}

export async function testSupabaseConnection() {
  const sb = getSupabaseAdmin();
  if (!sb) {
    logger.info('Supabase not configured — running without persistence');
    return false;
  }
  try {
    const { error } = await sb.from('rooms').select('room_id').limit(1);
    if (error) throw error;
    logger.info('Supabase connected');
    return true;
  } catch (err) {
    logger.warn('Supabase connection failed — running without persistence', {
      reason: err.message,
    });
    return false;
  }
}
