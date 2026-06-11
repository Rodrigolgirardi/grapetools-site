import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    source: "grape-tools-b2b",
    integration: "erp.orders",
    data: []
  });
}

export async function POST(request: Request) {
  const payload = await request.json();

  return NextResponse.json(
    {
      source: "grape-tools-b2b",
      integration: "erp.orders",
      status: "received",
      data: payload
    },
    { status: 201 }
  );
}
