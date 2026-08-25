import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const clients = await prisma.client.findMany({
    orderBy: { createdAt: "desc" },
    include: { company: true },
  });

  return NextResponse.json(clients);
}

export async function POST(request: Request) {
  const body = await request.json();

  const client = await prisma.client.create({
    data: {
      name: body.name,
      email: body.email || null,
      phone: body.phone || null,
      companyId: body.companyId,
    },
  });

  return NextResponse.json(client);
}

export async function PATCH(request: Request) {
  const body = await request.json();

  const client = await prisma.client.update({
    where: { id: body.id },
    data: {
      name: body.name,
      email: body.email,
      phone: body.phone,
      companyId: body.companyId,
    },
  });

  return NextResponse.json(client);
}

export async function DELETE(request: Request) {
  const body = await request.json();

  await prisma.client.delete({
    where: { id: body.id },
  });

  return NextResponse.json({ success: true });
}
