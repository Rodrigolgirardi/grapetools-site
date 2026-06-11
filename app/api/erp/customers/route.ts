import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    source: "grape-tools-b2b",
    integration: "erp.customers",
    data: []
  });
}
