-- CreateTable
CREATE TABLE "account_verifications" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ(6),
    "used_at" TIMESTAMPTZ(6),

    CONSTRAINT "account_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "account_verifications_token_key" ON "account_verifications"("token");

-- AddForeignKey
ALTER TABLE "account_verifications" ADD CONSTRAINT "account_verifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
