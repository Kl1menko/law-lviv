-- CreateEnum
CREATE TYPE "AdminTemplateType" AS ENUM ('intake_questionnaire', 'message_template', 'handoff_rule', 'case_brief');

-- CreateEnum
CREATE TYPE "ConsultationStatus" AS ENUM ('scheduled', 'completed', 'canceled', 'no_show');

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "assignedTo" TEXT,
ADD COLUMN     "intakeSummary" TEXT,
ADD COLUMN     "internalNotes" TEXT;

-- CreateTable
CREATE TABLE "AdminTemplate" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "type" "AdminTemplateType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "channel" TEXT,
    "content" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consultation" (
    "id" TEXT NOT NULL,
    "leadId" TEXT,
    "clientName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "format" TEXT NOT NULL,
    "status" "ConsultationStatus" NOT NULL DEFAULT 'scheduled',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Consultation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminTemplate_key_key" ON "AdminTemplate"("key");

-- AddForeignKey
ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;
