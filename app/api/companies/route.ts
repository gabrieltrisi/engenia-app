import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET - listar empresas
export async function GET() {
  try {
    const companies = await prisma.company.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(companies);
  } catch (error) {
    console.error("Erro ao buscar empresas:", error);

    return NextResponse.json(
      { error: "Erro ao buscar empresas." },
      { status: 500 },
    );
  }
}

// POST - criar empresa
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.name) {
      return NextResponse.json(
        { error: "Nome da empresa é obrigatório." },
        { status: 400 },
      );
    }

    const company = await prisma.company.create({
      data: {
        name: body.name,
      },
    });

    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar empresa:", error);

    return NextResponse.json(
      { error: "Erro ao criar empresa." },
      { status: 500 },
    );
  }
}

// PATCH - editar empresa
export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json({ error: "ID é obrigatório." }, { status: 400 });
    }

    const updatedCompany = await prisma.company.update({
      where: {
        id: body.id,
      },
      data: {
        name: body.name,
      },
    });

    return NextResponse.json(updatedCompany);
  } catch (error) {
    console.error("Erro ao atualizar empresa:", error);

    return NextResponse.json(
      { error: "Erro ao atualizar empresa." },
      { status: 500 },
    );
  }
}

// DELETE - deletar empresa
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get("id");

    // fallback: aceitar body também
    if (!id) {
      try {
        const body = await req.json();
        id = body.id;
      } catch {
        id = null;
      }
    }

    if (!id) {
      return NextResponse.json(
        { error: "ID da empresa é obrigatório." },
        { status: 400 },
      );
    }

    await prisma.company.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: "Empresa deletada com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao deletar empresa:", error);

    return NextResponse.json(
      { error: "Erro ao deletar empresa." },
      { status: 500 },
    );
  }
}
