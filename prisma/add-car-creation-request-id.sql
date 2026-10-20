BEGIN;

ALTER TABLE "cars"
ADD COLUMN IF NOT EXISTS "creationRequestId" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "cars_creationRequestId_key"
ON "cars" ("creationRequestId");

COMMIT;
