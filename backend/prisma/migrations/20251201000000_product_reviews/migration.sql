-- Create ProductReview table for recorded customer feedback and references.
CREATE TABLE "ProductReview" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "productId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "rating" INTEGER NOT NULL,
  "title" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "images" JSONB,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE "ProductReview"
  ADD CONSTRAINT "ProductReview_productId_fkey"
  FOREIGN KEY ("productId")
  REFERENCES "Product"("id")
  ON DELETE CASCADE;

ALTER TABLE "ProductReview"
  ADD CONSTRAINT "ProductReview_userId_fkey"
  FOREIGN KEY ("userId")
  REFERENCES "User"("id")
  ON DELETE CASCADE;

ALTER TABLE "ProductReview"
  ADD CONSTRAINT "ProductReview_orderId_fkey"
  FOREIGN KEY ("orderId")
  REFERENCES "Order"("id")
  ON DELETE CASCADE;

CREATE UNIQUE INDEX "ProductReview_userId_productId_key" ON "ProductReview"("userId", "productId");
CREATE INDEX "ProductReview_productId_index" ON "ProductReview"("productId");
CREATE INDEX "ProductReview_userId_index" ON "ProductReview"("userId");
