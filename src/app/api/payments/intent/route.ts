import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const body = await req.json().catch(() => ({}));
	// For now, just proxy pattern placeholder; real creation happens in API service
	return NextResponse.json({ ok: true, amount: body?.amount ?? 0 });
}

