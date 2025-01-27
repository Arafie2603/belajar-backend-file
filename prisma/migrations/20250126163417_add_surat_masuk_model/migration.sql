-- CreateTable
CREATE TABLE `SuratMasuk` (
    `no_surat_masuk` VARCHAR(191) NOT NULL,
    `tanggal` DATETIME(3) NOT NULL,
    `alamat` VARCHAR(100) NOT NULL,
    `perihal` VARCHAR(100) NOT NULL,
    `tujuan` VARCHAR(191) NOT NULL,
    `organisasi` VARCHAR(191) NOT NULL,
    `pengirim` VARCHAR(191) NOT NULL,
    `penerima` VARCHAR(191) NOT NULL,
    `sifat_surat` VARCHAR(191) NOT NULL,
    `scan_surat` VARCHAR(191) NOT NULL,
    `expired_data` DATETIME(3) NOT NULL,

    PRIMARY KEY (`no_surat_masuk`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
