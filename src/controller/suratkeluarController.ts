import { NextFunction, Request, Response, response } from "express"
import { SuratKeluarService } from "../services/suratkeluarService";
import { responseError } from "../error/responseError";

export class suratkeluarController {
    static async getAllSuratkeluar(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const totalData = parseInt(req.query.totalData as string) || 10;
            const sifat_surat = req.query.sifat_surat as string | undefined;

            const response = await SuratKeluarService.getAllSuratKeluar(page, totalData, sifat_surat);

            res.status(200).json({
                data: {
                    paginatedData: response.data,
                    meta: response.meta,
                },
                status: 200,
                message: 'Surat keluar retrieved successfully',
            });
        } catch (error: any) {
            res.status(500).json({
                data: response,
                errors: error.message || null,
            });
        }
    }

    static async getSuratmasukById(req: Request, res: Response) {
        try {
            const id: string = req.params.id;

            console.log(id)
            const suratkeluar = await SuratKeluarService.getSuratkeluarById(id);

            if (suratkeluar) {
                res.status(200).json({
                    status: 200,
                    data: suratkeluar,
                    message: 'Surat masuk retrieved successfully',
                });
            } else {
                res.status(404).json({
                    status: 404,
                    message: 'Surat masuk not found'
                });
            }
        } catch (error: any) {
            res.status(500).json({
                data: response,
                errors: error.message || null,
            });
        }
    }

    static async CreateSuratKeluar(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({
                    status: 401,
                    message: 'User not authenticated',
                });
                return;
            }

            console.log('Authenticate user: ', req.user);

            const suratkeluar = await SuratKeluarService.createSuratkeluar(
                req.body,
                req.user.id,
                req.file,
            );

            res.status(201).json({
                data: suratkeluar,
                status: 201,
                message: 'Surat keluar created successfully',
            });
        } catch (error: any) {
            console.log(error);
            res.status(500).json({
                status: 500,
                message: 'Internal server error',
                errors: error.message,
            });
        }
    }

    static async updateSuratKeluar(req: Request, res: Response) {
        try {
            const suratKeluarId = req.params.id;
            const file = req.file;
            const {
                tanggal_surat,
                tempat_surat,
                lampiran,
                isi_surat,
                penerima,
                pengirim,
                jabatan_pengirim,
                keterangan_gambar,
                sifat_surat
            } = req.body;

            const updateRequest = {
                tanggal_surat: tanggal_surat ? new Date(tanggal_surat) : undefined,
                tempat_surat,
                lampiran,
                isi_surat,
                penerima,
                pengirim,
                jabatan_pengirim,
                keterangan_gambar,
                sifat_surat
            };

            const updatedSuratKeluar = await SuratKeluarService.updateSuratkeluar(
                suratKeluarId,
                updateRequest,
                file
            );

            res.status(200).json({
                message: "Surat Keluar updated successfully",
                data: updatedSuratKeluar
            });
        } catch (error) {
            if (error instanceof responseError) {
                res.status(error.status).json({ message: error.message });
            } else {
                console.error(error);
                res.status(500).json({ message: "Internal server error" });
            }
        }
    }

    static async deleteSuratkeluar(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await SuratKeluarService.deleteSuratkeluar(id);
            res.status(200).json({
                status: 200,
                message: 'Surat keluar deleted successfully',
            });
        } catch (error: any) {
            res.status(500).json({
                status: 500,
                message: error.message
            });
        }
    }
}