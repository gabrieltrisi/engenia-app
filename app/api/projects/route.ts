import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        client: true,
        company: true,
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Erro ao buscar projetos:", error);

    return NextResponse.json(
      { error: "Erro ao buscar projetos." },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (
      !body.name ||
      !body.budget ||
      !body.status ||
      !body.companyId ||
      !body.clientId
    ) {
      return NextResponse.json(
        { error: "Campos obrigatórios não preenchidos." },
        { status: 400 },
      );
    }

    const project = await prisma.project.create({
      data: {
        name: body.name,
        budget: Number(body.budget),
        status: body.status,
        companyId: body.companyId,
        clientId: body.clientId,
        startDate: body.startDate ? new Date(body.startDate) : null,
        expectedEndDate: body.expectedEndDate
          ? new Date(body.expectedEndDate)
          : null,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar projeto:", error);

    return NextResponse.json(
      { error: "Erro ao criar projeto." },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json({ error: "ID é obrigatório." }, { status: 400 });
    }

    const updatedProject = await prisma.project.update({
      where: {
        id: body.id,
      },
      data: {
        name: body.name,
        budget: Number(body.budget),
        status: body.status,
        startDate: body.startDate ? new Date(body.startDate) : null,
        expectedEndDate: body.expectedEndDate
          ? new Date(body.expectedEndDate)
          : null,
      },
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error("Erro ao atualizar projeto:", error);

    return NextResponse.json(
      { error: "Erro ao atualizar projeto." },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get("id");

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
        { error: "ID do projeto é obrigatório." },
        { status: 400 },
      );
    }

    await prisma.project.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: "Projeto deletado com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao deletar projeto:", error);

    return NextResponse.json(
      { error: "Erro ao deletar projeto." },
      { status: 500 },
    );
  }
}
