import { createClient } from '@supabase/supabase-js';

// Default project configuration
export const DEFAULT_SUPABASE_URL = 'https://nfsttzbqcfsffnojikyo.supabase.co';

// Helper to get active URL & Anon Key from Vite env or local storage
export function getSupabaseCredentials() {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const localKey = typeof window !== 'undefined' ? localStorage.getItem('poddars_supabase_anon_key') : null;
  const localUrl = typeof window !== 'undefined' ? localStorage.getItem('poddars_supabase_url') : null;

  const url = (envUrl || localUrl || DEFAULT_SUPABASE_URL).trim();
  const anonKey = (envKey || localKey || '').trim();

  return { url, anonKey, isConfigured: Boolean(url && anonKey) };
}

let supabaseInstance = null;
let currentKeyRef = '';

export function getSupabaseClient() {
  const { url, anonKey, isConfigured } = getSupabaseCredentials();
  if (!isConfigured) return null;

  if (!supabaseInstance || currentKeyRef !== anonKey) {
    supabaseInstance = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
    currentKeyRef = anonKey;
  }
  return supabaseInstance;
}

export function saveSupabaseCredentials(key, customUrl = null) {
  if (typeof window !== 'undefined') {
    if (key) localStorage.setItem('poddars_supabase_anon_key', key.trim());
    if (customUrl) localStorage.setItem('poddars_supabase_url', customUrl.trim());
    supabaseInstance = null;
    currentKeyRef = '';
  }
  return getSupabaseClient();
}

// -------------------------------------------------------------
// AUTHENTICATION METHODS
// -------------------------------------------------------------

export async function signUpUser({ email, password, fullName, phone }) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error('Supabase Anon Key is not configured yet. Please configure it in settings or .env');
  }

  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: {
        full_name: fullName?.trim() || '',
        phone: phone?.trim() || ''
      }
    }
  });

  if (error) throw error;

  // Auto create or update profile row in profiles table
  if (data?.user) {
    try {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email: data.user.email,
        full_name: fullName?.trim() || data.user.email?.split('@')[0],
        phone: phone?.trim() || '',
        updated_at: new Date().toISOString()
      });
    } catch (e) {
      console.warn('Profile upsert warning:', e);
    }
  }

  return data;
}

export async function signInUser({ email, password }) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error('Supabase is not configured yet. Please check your project keys.');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password
  });

  if (error) throw error;
  return data;
}

export async function signOutUser() {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Supabase sign out error:', e);
    }
  }
  if (typeof window !== 'undefined') {
    localStorage.removeItem('poddars_user_profile');
  }
}

export async function resetPasswordForEmail(email) {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error('Supabase is not configured.');

  const { data, error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: window.location.origin
  });
  if (error) throw error;
  return data;
}

export async function getCurrentSession() {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data?.session || null;
}

export async function getUserProfile(userId) {
  const supabase = getSupabaseClient();
  if (!supabase || !userId) return null;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

// -------------------------------------------------------------
// ORDER HISTORY & PERSISTENCE METHODS
// -------------------------------------------------------------

export async function saveOrderToSupabase(order, user = null) {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const orderRecord = {
      id: order.id,
      user_id: user?.id || null,
      guest_name: order.guestName || (user?.user_metadata?.full_name) || 'Guest',
      user_email: user?.email || null,
      mode: order.mode || 'Dine in',
      table_number: order.table || null,
      items: order.items || [],
      instructions: order.instructions || '',
      subtotal: Number(order.subtotal || 0),
      discount: Number(order.discount || 0),
      discount_label: order.discountLabel || '',
      gst: Number(order.gst || 0),
      total: Number(order.total || 0),
      status: order.status || 'New',
      payment_status: order.paymentStatus || 'Unpaid',
      payment_method: order.paymentMethod || 'Pending at Table',
      paid_at: order.paidAt || null,
      estimated_prep_time: order.estimatedPrepTime ? Number(order.estimatedPrepTime) : null,
      approved_at: order.approvedAt || null,
      ready_at: order.readyAt || null,
      completed_at: order.completedAt || null,
      cancelled_at: order.cancelledAt || null,
      chef_note: order.chefNote || '',
      rejection_reason: order.rejectionReason || null,
      created_at: order.createdAt || new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('orders')
      .upsert(orderRecord, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.warn('Could not persist order to Supabase:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Supabase saveOrder exception:', err);
    return null;
  }
}

export async function fetchUserOrderHistory(userId, userEmail = null) {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  try {
    let query = supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (userId && userEmail) {
      query = query.or(`user_id.eq.${userId},user_email.eq.${userEmail}`);
    } else if (userId) {
      query = query.eq('user_id', userId);
    } else if (userEmail) {
      query = query.eq('user_email', userEmail);
    } else {
      return [];
    }

    const { data, error } = await query;
    if (error) {
      console.warn('Supabase fetchUserOrderHistory error:', error.message);
      return [];
    }

    // Map database snake_case back to frontend order structure
    return (data || []).map(row => ({
      id: row.id,
      status: row.status,
      createdAt: row.created_at,
      guestName: row.guest_name,
      mode: row.mode,
      table: row.table_number,
      items: row.items || [],
      instructions: row.instructions,
      subtotal: Number(row.subtotal),
      discount: Number(row.discount),
      discountLabel: row.discount_label,
      gst: Number(row.gst),
      total: Number(row.total),
      paymentStatus: row.payment_status,
      paymentMethod: row.payment_method,
      paidAt: row.paid_at,
      estimatedPrepTime: row.estimated_prep_time,
      approvedAt: row.approved_at,
      readyAt: row.ready_at,
      completedAt: row.completed_at,
      cancelledAt: row.cancelled_at,
      chefNote: row.chef_note,
      rejectionReason: row.rejection_reason
    }));
  } catch (err) {
    console.warn('Supabase order history exception:', err);
    return [];
  }
}

export async function updateSupabaseOrderStatus(orderId, updates = {}) {
  const supabase = getSupabaseClient();
  if (!supabase || !orderId) return null;

  try {
    const payload = {};
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.paymentStatus !== undefined) payload.payment_status = updates.paymentStatus;
    if (updates.paymentMethod !== undefined) payload.payment_method = updates.paymentMethod;
    if (updates.paidAt !== undefined) payload.paid_at = updates.paidAt;
    if (updates.approvedAt !== undefined) payload.approved_at = updates.approvedAt;
    if (updates.readyAt !== undefined) payload.ready_at = updates.readyAt;
    if (updates.completedAt !== undefined) payload.completed_at = updates.completedAt;
    if (updates.cancelledAt !== undefined) payload.cancelled_at = updates.cancelledAt;
    if (updates.estimatedPrepTime !== undefined) payload.estimated_prep_time = updates.estimatedPrepTime;
    if (updates.chefNote !== undefined) payload.chef_note = updates.chefNote;
    if (updates.rejectionReason !== undefined) payload.rejection_reason = updates.rejectionReason;

    const { data, error } = await supabase
      .from('orders')
      .update(payload)
      .eq('id', orderId)
      .select();

    if (error) {
      console.warn('Error updating order in Supabase:', error.message);
      return null;
    }
    return data;
  } catch (e) {
    console.warn('updateSupabaseOrderStatus exception:', e);
    return null;
  }
}
