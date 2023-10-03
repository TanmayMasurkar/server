import express from "express";
import { deleteUser, getSingleUser, getUserRecords, newUser, signIn, signUp, updateUser } from "../controller/user.controller";
import { authenticate, isAdmin } from "../middleware/auth";


const router = express.Router();

router.get("/", getUserRecords);

router.post('/add-user', authenticate, isAdmin, newUser);

router.get("/:user_id",authenticate, isAdmin, getSingleUser);

router.delete("/:user_id",authenticate, isAdmin, deleteUser);

router.put('/:user_id',authenticate, isAdmin,updateUser)



router.post('/signup', signUp)
router.post('/signin', signIn)
export default router;