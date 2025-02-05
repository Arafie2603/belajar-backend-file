import { NomorSurat } from "@prisma/client";

export type createNomorSurat = {
    nomor_surat: string;
    keterangan: string;
    deskripsi: string;
};


export type NomorSuratResponse = {
    nomor_surat: string;
    keterangan: string;
    deskripsi: string;
};

export function toNomorSuratResponse(nomorSurat: NomorSurat): NomorSuratResponse {
    return {
        nomor_surat: nomorSurat.nomor_surat,
        keterangan: nomorSurat.keterangan,
        deskripsi: nomorSurat.deskripsi,
    }
}