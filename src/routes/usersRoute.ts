import express from 'express';
import { usersController } from '../controller/userController';
import { authMiddleware, refreshJWT } from '../middleware/authMiddleware';
import { upload } from '../middleware/mutler';


const router = express.Router();
/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication
 *   - name: Users
 *     description: CRUD Users
 *   - name: Nomor Surat
 *     description: CRUD Nomor Surat
 *   - name: Surat Masuk
 *     description: CRUD Surat Masuk
 *   - name: Surat Keluar
 *     description: CRUD Surat Keluar
 *   - name: Faktur
 *     description: CRUD Faktur
 *   - name: Notulen
 *     description: CRUD Notulen
 */
/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: "Login pengguna"
 *     tags:
 *       - Auth
 *     description: "Melakukan login dengan nomor identitas dan password."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nomor_identitas:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               nomor_identitas: "2111500340"
 *               password: "123"
 *     responses:
 *       200:
 *         description: "Berhasil login"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         nomor_identitas:
 *                           type: string
 *                         password:
 *                           type: string
 *                         role:
 *                           type: string
 *                     token:
 *                       type: string
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *               example:
 *                 data:
 *                   user:
 *                     id: "b659245d-f148-419f-b44a-374b3234e815"
 *                     nomor_identitas: "2111500340"
 *                     password: "$2b$10$MVE.62VJaLLAlAcReKtAnORXhgkW9Z.qLuC3rEGGRe2yAcClHSUie"
 *                     role: "user"
 *                   token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImI2NTkyNDVkLWYxNDgtNDE5Zi1iNDRhLTM3NGIzMjM0ZTgxNSIsInJvbGUiOnsicm9sZV9pZCI6ImNmZWIyZDk4LTFhN2QtNGFlNS04OGIzLTZiMjU2MWZhMTk0MCIsIm5hbWEiOiJ1c2VyIn0sImlhdCI6MTczODU4NjE5NSwiZXhwIjoxNzM4NjcyNTk1fQ.JzP21AV71a_DpfQx64YiaDNxoOzhhvqsGKMn0KNliGI"
 *                 status: 200
 *                 message: "Successfully logged in"
 *       401:
 *         description: "Email atau password salah"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *               example:
 *                 status: 401
 *                 message: "Email or password is wrong"
 *       500:
 *         description: "Internal Server Error"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *               example:
 *                 status: 500
 *                 message: "Internal Server Error"
 */

router.post('/login', usersController.login);

/**
 * @swagger
 * /api/users/refresh:
 *   post:
 *     summary: "Memperbarui token JWT"
 *     tags:
 *       - Auth
 *     description: "Memperbarui token JWT yang sudah ada dengan token baru."
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: "Token berhasil diperbarui"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *               example:
 *                 token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImVmZTg2NTk0LTIzNDUtNDEzNi05Yzk1LWJlOTJhMTE1ZGVlOSIsInJvbGUiOnsicm9sZV9pZCI6IjhlYWQxZjMyLTg0ZDEtNGMyZS05ZThhLTVmMjBmYTc4M2EzNSIsIm5hbWEiOiJ1c2VyIn0sImlhdCI6MTczODU4NjY1NCwiZXhwIjoxNzM4NjczMDU0fQ.lNaUqVatsU--OUa7q-ExiS04y92KVMDebvudZ6q6Lko"
 *       401:
 *         description: "Token tidak valid atau tidak disediakan"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *               example:
 *                 status: 401
 *                 message: "Unauthorized"
 *       403:
 *         description: "Token tidak valid atau kedaluwarsa"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "Forbidden"
 *       500:
 *         description: "Kesalahan Server Internal"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *               example:
 *                 status: 500
 *                 message: "Internal Server Error"
 */

router.post('/refresh', authMiddleware, refreshJWT);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: "Mengambil profil pengguna yang telah login"
 *     tags:
 *       - Users
 *     description: "Mengambil profil pengguna yang telah login berdasarkan token otentikasi."
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: "Profil pengguna berhasil diambil"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         nama:
 *                           type: string
 *                         nomor_identitas:
 *                           type: string
 *                         fakultas:
 *                           type: string
 *                         prodi:
 *                           type: string
 *                         foto:
 *                           type: string
 *                         alamat:
 *                           type: string
 *                         jabatan:
 *                           type: string
 *                         password:
 *                           type: string
 *                         no_telp:
 *                           type: string
 *                         role:
 *                           type: string
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *               example:
 *                 data:
 *                   user:
 *                     id: "4d35d7bd-3b56-4f42-bce3-c7458179765a"
 *                     nama: "Arafie"
 *                     nomor_identitas: "2111500341"
 *                     fakultas: "FTI"
 *                     prodi: "Teknik Informatika"
 *                     foto: "http://bucket-production-2f24.up.railway.app:443/asisten/Aotearoa.jpg"
 *                     alamat: ""
 *                     jabatan: "presiden kerajaan mueshern"
 *                     password: "$2b$10$grHvmCKgZARg1z9Afy9W5uprcbsIbU.BxJCWSFUJG7zGegNjWXzwm"
 *                     no_telp: "+60787293"
 *                     role: "user"
 *                 status: 200
 *                 message: "Profile retrieved successfully"
 *       401:
 *         description: "Tidak ada token yang disediakan"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *               example:
 *                 status: 401
 *                 message: "No token provided"
 *       404:
 *         description: "Pengguna tidak ditemukan"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *               example:
 *                 status: 404
 *                 message: "User Not Found"
 *       500:
 *         description: "Kesalahan Server Internal"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 errors:
 *                   type: string
 *               example:
 *                 status: 500
 *                 message: "Internal Server Error"
 *                 errors: "User Not Found"
 */

router.get('/profile', authMiddleware, usersController.getProfile);


/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: "Registrasi pengguna baru"
 *     tags:
 *       - Users
 *     description: "Registrasi pengguna baru dengan nomor identitas, nama, password, dan data lainnya."
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nama:
 *                 type: string
 *               foto:
 *                 type: string
 *                 format: binary
 *               alamat:
 *                 type: string
 *               fakultas:
 *                 type: string
 *               prodi:
 *                 type: string
 *               jabatan:
 *                 type: string
 *               nomor_identitas:
 *                 type: string
 *               password:
 *                 type: string
 *               no_telp:
 *                 type: string
 *             example:
 *               nama: "Arafie"
 *               foto: ""
 *               alamat: "Jalan Merdeka No. 1"
 *               fakultas: "FTI"
 *               prodi: "Teknik Informatika"
 *               jabatan: "presiden kerajaan mueshern"
 *               nomor_identitas: "2111500341"
 *               password: "123"
 *               no_telp: "+60787293"
 *     responses:
 *       201:
 *         description: "Pengguna berhasil dibuat"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         nama:
 *                           type: string
 *                         nomor_identitas:
 *                           type: string
 *                         fakultas:
 *                           type: string
 *                         prodi:
 *                           type: string
 *                         foto:
 *                           type: string
 *                         alamat:
 *                           type: string
 *                         jabatan:
 *                           type: string
 *                         password:
 *                           type: string
 *                         no_telp:
 *                           type: string
 *                         role:
 *                           type: string
 *                     token:
 *                       type: string
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *               example:
 *                 data:
 *                   user:
 *                     id: "4d35d7bd-3b56-4f42-bce3-c7458179765a"
 *                     nama: "Arafie"
 *                     nomor_identitas: "2111500341"
 *                     fakultas: "FTI"
 *                     prodi: "Teknik Informatika"
 *                     foto: "http://bucket-production-2f24.up.railway.app:443/asisten/Aotearoa.jpg"
 *                     alamat: "Jalan Merdeka No. 1"
 *                     jabatan: "presiden kerajaan mueshern"
 *                     password: "$2b$10$grHvmCKgZARg1z9Afy9W5uprcbsIbU.BxJCWSFUJG7zGegNjWXzwm"
 *                     no_telp: "+60787293"
 *                     role: "user"
 *                   token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRkMzVkN2JkLTNiNTYtNGY0Mi1iY2UzLWM3NDU4MTc5NzY1YSIsInJvbGUiOnsicm9sZV9pZCI6ImE1OTg3YmI0LWY4ZTctNDlkZS04ODExLWQ1MWE0Y2Q1YWM4MyIsIm5hbWEiOiJ1c2VyIn0sImlhdCI6MTc0MDkwMDQ4OCwiZXhwIjoxNzQwOTg2ODg4fQ.BwHdpZ91An0GUqgEg8b8vyl-rWu87eVlipjk_5Y_zA8"
 *                 status: 201
 *                 message: "User created successfully"
 *       400:
 *         description: "Nomor identitas sudah ada atau input tidak valid"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *               example:
 *                 status: 400
 *                 message: "Nomor identitas already exists"
 *       500:
 *         description: "Kesalahan Server Internal"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *               example:
 *                 status: 500
 *                 message: "Internal Server Error"
 */


router.post('/register', upload.single('foto') ,usersController.register);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: "Mengambil daftar pengguna"
 *     tags:
 *       - Users
 *     description: "Mengambil daftar pengguna dengan fitur pagination."
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         description: "Nomor halaman yang ingin diambil"
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: totalData
 *         in: query
 *         description: "Jumlah data per halaman"
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: "Daftar pengguna berhasil diambil"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     paginatedData:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           nama:
 *                             type: string
 *                           nomor_identitas:
 *                             type: string
 *                           fakultas:
 *                             type: string
 *                           prodi:
 *                             type: string
 *                           foto:
 *                             type: string
 *                           alamat:
 *                             type: string
 *                           jabatan:
 *                             type: string
 *                           password:
 *                             type: string
 *                           no_telp:
 *                             type: string
 *                           role:
 *                             type: string
 *                     meta:
 *                       type: object
 *                       properties:
 *                         currentPage:
 *                           type: integer
 *                         offset:
 *                           type: integer
 *                         itemsPerPage:
 *                           type: integer
 *                         unpaged:
 *                           type: boolean
 *                         totalPages:
 *                           type: integer
 *                         totalItems:
 *                           type: integer
 *                         sortBy:
 *                           type: array
 *                           items:
 *                             type: string
 *                         filter:
 *                           type: object
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *               example:
 *                 data:
 *                   paginatedData:
 *                     - id: "3c823d31-c869-4517-bad7-3b0b368f0f10"
 *                       nama: "Arafie"
 *                       nomor_identitas: "2111500341"
 *                       fakultas: "FTI"
 *                       prodi: "Teknik Informatika"
 *                       foto: "http://bucket-production-2f24.up.railway.app:443/asisten/Aotearoa.jpg"
 *                       alamat: ""
 *                       jabatan: "presiden kerajaan mueshern"
 *                       password: "$2b$10$UltoGgWlBlBMyNzjZUJRTOyw1/PXcQwhQ9OEyhMuL5VcsiCWxFgyO"
 *                       no_telp: "+60787293"
 *                       role: "user"
 *                   meta:
 *                     currentPage: 1
 *                     offset: 0
 *                     itemsPerPage: 10
 *                     unpaged: false
 *                     totalPages: 1
 *                     totalItems: 1
 *                     sortBy: []
 *                     filter: {}
 *                 status: 200
 *                 message: "Users retrieved successfully"
 *       500:
 *         description: "Internal Server Error"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *             example:
 *               status: 500
 *               message: "Internal Server Error"
 */

router.get('/', authMiddleware, usersController.getAllUsers);



/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: "Memperbarui pengguna berdasarkan ID"
 *     tags:
 *       - Users
 *     description: "Memperbarui pengguna berdasarkan ID yang diberikan."
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: "ID pengguna yang ingin diperbarui"
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nama:
 *                 type: string
 *               foto:
 *                 type: string
 *                 format: binary
 *               alamat:
 *                 type: string
 *               fakultas:
 *                 type: string
 *               prodi:
 *                 type: string
 *               jabatan:
 *                 type: string
 *               nomor_identitas:
 *                 type: string
 *               password:
 *                 type: string
 *               no_telp:
 *                 type: string
 *               role_id:
 *                 type: string
 *             example:
 *               nama: "Arafie"
 *               foto: ""
 *               alamat: "Jalan Merdeka No. 1"
 *               fakultas: "FTI"
 *               prodi: "Teknik Informatika"
 *               jabatan: "presiden kerajaan mueshern"
 *               nomor_identitas: "2111500341"
 *               password: "123"
 *               no_telp: "+60787293"
 *               role_id: "1"
 *     responses:
 *       200:
 *         description: "Pengguna berhasil diperbarui"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     nama:
 *                       type: string
 *                     nomor_identitas:
 *                       type: string
 *                     fakultas:
 *                       type: string
 *                     prodi:
 *                       type: string
 *                     foto:
 *                       type: string
 *                     alamat:
 *                       type: string
 *                     jabatan:
 *                       type: string
 *                     password:
 *                       type: string
 *                     no_telp:
 *                       type: string
 *                     role:
 *                       type: string
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *               example:
 *                 data:
 *                   id: "510ff921-b6ca-4b6d-b916-a69dad29df99"
 *                   nama: "Arafie"
 *                   nomor_identitas: "2111500341"
 *                   fakultas: "FTI"
 *                   prodi: "Teknik Informatika"
 *                   foto: "http://bucket-production-2f24.up.railway.app:443/asisten/Aotearoa.jpg"
 *                   alamat: "Jalan Merdeka No. 1"
 *                   jabatan: "presiden kerajaan mueshern"
 *                   password: "$2b$10$sj2/0t5sUeIveXD9StivVuf0kQcxehD4CiGMvMEyKxcR6yc3pxwOi"
 *                   no_telp: "+60787293"
 *                   role: "user"
 *                 status: 200
 *                 message: "User updated successfully"
 *       404:
 *         description: "ID pengguna tidak ditemukan"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 errors:
 *                   type: string
 *               example:
 *                 status: 404
 *                 message: "ID pengguna tidak ditemukan"
 *                 errors: null
 *       500:
 *         description: "Kesalahan Server Internal"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 errors:
 *                   type: string
 *               example:
 *                 status: 500
 *                 message: "Internal Server Error"
 *                 errors: "User Not Found"
 */

router.patch('/:id', upload.single('foto'), authMiddleware, usersController.updateUser);


/**
 * @swagger
 * /api/users/{nomor_identitas}:
 *   delete:
 *     summary: "Menghapus pengguna berdasarkan nomor identitas"
 *     tags:
 *       - Users
 *     description: "Menghapus pengguna berdasarkan nomor identitas yang diberikan."
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: nomor_identitas
 *         in: path
 *         description: "Nomor identitas pengguna yang ingin dihapus"
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Pengguna berhasil dihapus"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *               example:
 *                 status: 200
 *                 message: "User deleted successfully"
 *       404:
 *         description: "Nomor identitas tidak ditemukan"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *               example:
 *                 status: 404
 *                 message: "Nomor identitas not found"
 *       500:
 *         description: "Kesalahan Server Internal"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *               example:
 *                 status: 500
 *                 message: "Internal Server Error"
 */

router.delete('/:nomor_identitas', authMiddleware, usersController.deleteUser);



/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     summary: "Logout dari aplikasi"
 *     tags:
 *       - Users
 *     description: "Endpoint ini untuk logout dari aplikasi"
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: "Logout successful"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Logout successful"
 *       400:
 *         description: "Token is required"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Token is required"
 *       500:
 *         description: "Internal server error"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.post('/logout', authMiddleware, usersController.logout);




export default router;