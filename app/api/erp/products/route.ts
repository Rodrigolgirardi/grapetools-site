import { NextResponse } from "next/server";
import { products } from "@/lib/data";

export async function GET() {
  return NextResponse.json({
    source: "grape-tools-b2b",
    integration: "erp.products",
    data: products
  });
}
