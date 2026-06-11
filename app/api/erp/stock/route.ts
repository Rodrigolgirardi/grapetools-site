import { NextResponse } from "next/server";
import { products } from "@/lib/data";

export async function GET() {
  return NextResponse.json({
    source: "grape-tools-b2b",
    integration: "erp.stock",
    data: products.map((product) => ({
      sku: product.sku,
      stock: product.stock
    }))
  });
}
