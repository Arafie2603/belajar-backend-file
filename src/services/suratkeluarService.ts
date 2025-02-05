import { prismaClient } from "../application/database";
import { responseError } from "../error/responseError";
import { MINIO_ENDPOINT, MINIO_PORT } from "../helper/minioClient";
import { CreateSuratkeluarRequest, SuratkeluarResponse } from "../model/suratkeluarModel";


export class suratkeluarService {
    static async createSuratkeluar(
        request: CreateSuratkeluarRequest,
        file: Express.Multer.File,
        userId: string,
    ): Promise<SuratkeluarResponse> {
        const user = await prismaClient.user.findUnique({
            where: { id: userId },
        });

        if(!user) {
            throw new responseError(404, `User with ID ${userId} not found`);
        }


        const modifiedRequest = {
            ...request,
            user_id: userId,
            tanggal_surat: typeof request.tanggal_surat === 'string'
                ? new Date(request.tanggal_surat).toISOString()
                : new Date(JSON.stringify(request.tanggal_surat)).toISOString(),
        }

        const filename = `${Date.now()}-${file.originalname}`;
        const bucketName = 'suratmasuk';
        const fileUrl = `http://${MINIO_ENDPOINT}:${MINIO_PORT}/${bucketName}/${filename}`;

        const requestWithFile = {
            ...modifiedRequest,
            scan_surat: fileUrl,
            user_id: userId
        };

        const validationRequest = Validation.validate(
            suratmasukValidation.SuratmasukValidation,
            requestWithFile
        );

    }
}