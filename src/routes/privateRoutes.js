import { Router } from "express";
import { tokenValidated } from "../middlewares/auth.js";
import { correctTest } from "../controllers/AnswerController.js";
import multer from "multer";
const router = Router();
const uploadRAM = multer({ storage: multer.memoryStorage() });
const files = uploadRAM.fields([
    { name: 'image', maxCount: 1 },
    { name: 'pdf', maxCount: 1 }
]);
router.use(tokenValidated); 

router.get("/private", (req, res) => {
    const currentUser = JSON.parse(req.headers.user || {});
    return res.status(200).json({
        message: "Rota acessada com sucesso",
        data: {userLogged: currentUser}
    })
})

router.post("/check", files, correctTest )


export default router