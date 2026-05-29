// app/api/room-amenity/route.js

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// POST — assign an amenity to a room
export async function POST(request) {
  const supabase = createClient();
  const { roomId, amenityId } = await request.json();

  const { error } = await supabase
    .from('room_amenity')
    .insert({ room_id: roomId, amenity_id: amenityId });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

// DELETE — unassign (remove) an amenity from a room
export async function DELETE(request) {
  const supabase = createClient();
  const { roomId, amenityId } = await request.json();

  const { error } = await supabase
    .from('room_amenity')
    .delete()
    .eq('room_id', roomId)
    .eq('amenity_id', amenityId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}