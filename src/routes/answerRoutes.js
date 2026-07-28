import { Router } from "express";
import { tokenValidated } from "../middlewares/auth.js";
import SaveAnswerController  from "../controllers/SaveAnswerController.js";
const router = Router();
router.use(tokenValidated); 

router.post("/save", SaveAnswerController.saveAnswer)

router.get("/provas", SaveAnswerController.findAll)

router.get("/provas/:id", SaveAnswerController.findOne)

router.put("/:id", SaveAnswerController.update)

router.delete("/:id", SaveAnswerController.remove)



export default router