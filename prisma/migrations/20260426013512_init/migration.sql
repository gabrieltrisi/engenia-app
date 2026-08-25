-- =========================
-- Create Tables
-- =========================

CREATE TABLE "Company" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Client" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT,
  "phone" TEXT,
  "companyId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Project" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "budget" DOUBLE PRECISION NOT NULL,
  "companyId" TEXT NOT NULL,
  "clientId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Budget" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "totalCost" DOUBLE PRECISION NOT NULL,
  "projectId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Budget_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Proposal" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "value" DOUBLE PRECISION NOT NULL,
  "status" TEXT NOT NULL,
  "projectId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Proposal_pkey" PRIMARY KEY ("id")
);

-- =========================
-- Indexes
-- =========================

CREATE UNIQUE INDEX "User_email_key" ON "User" ("email");

-- =========================
-- Foreign Keys
-- =========================

ALTER TABLE "User"
ADD CONSTRAINT "User_companyId_fkey"
FOREIGN KEY ("companyId") REFERENCES "Company" ("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Client"
ADD CONSTRAINT "Client_companyId_fkey"
FOREIGN KEY ("companyId") REFERENCES "Company" ("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Project"
ADD CONSTRAINT "Project_companyId_fkey"
FOREIGN KEY ("companyId") REFERENCES "Company" ("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Project"
ADD CONSTRAINT "Project_clientId_fkey"
FOREIGN KEY ("clientId") REFERENCES "Client" ("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Budget"
ADD CONSTRAINT "Budget_projectId_fkey"
FOREIGN KEY ("projectId") REFERENCES "Project" ("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Proposal"
ADD CONSTRAINT "Proposal_projectId_fkey"
FOREIGN KEY ("projectId") REFERENCES "Project" ("id")
ON DELETE RESTRICT ON UPDATE CASCADE;