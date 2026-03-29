-- AlterTable
ALTER TABLE "organization" ADD COLUMN     "clients" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "member_projects" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "member_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MemberToMemberProjects" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MemberToMemberProjects_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "member_projects_projectId_clientId_idx" ON "member_projects"("projectId", "clientId");

-- CreateIndex
CREATE INDEX "_MemberToMemberProjects_B_index" ON "_MemberToMemberProjects"("B");

-- AddForeignKey
ALTER TABLE "_MemberToMemberProjects" ADD CONSTRAINT "_MemberToMemberProjects_A_fkey" FOREIGN KEY ("A") REFERENCES "member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MemberToMemberProjects" ADD CONSTRAINT "_MemberToMemberProjects_B_fkey" FOREIGN KEY ("B") REFERENCES "member_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
