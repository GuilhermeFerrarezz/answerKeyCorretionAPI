import { Router } from "express";
import { tokenValidated } from "../middlewares/auth.js";

const router = Router();

router.use(tokenValidated); 

router.get("/private", (req, res) => {
    const currentUser = JSON.parse(req.headers.user || {});
    return res.status(200).json({
        message: "Rota acessada com sucesso",
        data: {userLogged: currentUser}
    })
})


export default router