-- Penghitung kunjungan kumulatif yang tidak direset berdasarkan periode.
CREATE TABLE "SiteTraffic" (
    "id" TEXT NOT NULL,
    "total" BIGINT NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteTraffic_pkey" PRIMARY KEY ("id")
);
