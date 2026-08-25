import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type IncomingBudgetItem = {
  name?: string;
  category?: string;
  quantity?: number | string;
  unit?: string;
  unitCost?: number | string;
};

type ValidBudgetItem = {
  name: string;
  category: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = String(body.name || "").trim();
    const description = String(body.description || "").trim();
    const expectedRevenue = Number(body.expectedRevenue || 0);
    const projectId = String(body.projectId || "").trim();

    const items: IncomingBudgetItem[] = Array.isArray(body.items)
      ? body.items
      : [];

    if (!name) {
      return NextResponse.json(
        { message: "Nome do orçamento é obrigatório." },
        { status: 400 },
      );
    }

    if (!projectId) {
      return NextResponse.json(
        { message: "Projeto é obrigatório." },
        { status: 400 },
      );
    }

    if (items.length === 0) {
      return NextResponse.json(
        { message: "Adicione pelo menos um item." },
        { status: 400 },
      );
    }

    const validItems: ValidBudgetItem[] = items
      .map((item: IncomingBudgetItem): ValidBudgetItem => {
        const quantity = Number(item.quantity || 0);
        const unitCost = Number(item.unitCost || 0);

        return {
          name: String(item.name || "").trim(),
          category: String(item.category || "Material").trim(),
          quantity,
          unit: String(item.unit || "un").trim(),
          unitCost,
          totalCost: quantity * unitCost,
        };
      })
      .filter(
        (item: ValidBudgetItem) =>
          item.name.length > 0 && item.quantity > 0 && item.unitCost >= 0,
      );

    if (validItems.length === 0) {
      return NextResponse.json(
        { message: "Nenhum item válido informado." },
        { status: 400 },
      );
    }

    const totalCost = validItems.reduce(
      (total: number, item: ValidBudgetItem) => total + item.totalCost,
      0,
    );

    const marginValue = expectedRevenue - totalCost;

    const marginPercent =
      expectedRevenue > 0 ? (marginValue / expectedRevenue) * 100 : null;

    const budget = await prisma.budget.create({
      data: {
        name,
        description: description || null,
        projectId,
        totalCost,
        expectedRevenue: expectedRevenue > 0 ? expectedRevenue : null,
        marginPercent,
        status: "DRAFT",
        items: {
          create: validItems,
        },
      },
      include: {
        items: true,
        project: true,
      },
    });

    return NextResponse.json({ budget });
  } catch (error) {
    console.error("Erro ao criar orçamento:", error);

    return NextResponse.json(
      { message: "Erro interno ao salvar orçamento." },
      { status: 500 },
    );
  }
}
