-- CreateTable
CREATE TABLE "UserTest" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "UserTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostTest" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "PostTest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserTest_email_key" ON "UserTest"("email");

-- AddForeignKey
ALTER TABLE "PostTest" ADD CONSTRAINT "PostTest_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "UserTest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
