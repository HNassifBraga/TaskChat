// Routes -> camada de interface com o mundo externo.
// Define os endpoints da api. A ideia é mapear a url e o metodo http para o controller correspondente

import { Router } from "express";
import { UserController, CompanyControler, ChatController } from "./controllers";

import type { Request, Response } from 'express';


const router = Router();
const userController = new UserController();
const companyControler = new CompanyControler();
const chatcontroller = new ChatController();
router.post('/registerCompany', (req:Request,res:Response)=>{
    
    companyControler.handleCadastro(req,res);
})

router.post('/registerUser',(req:Request,res:Response)=>{
    userController.handleCadastro(req,res);
})


router.get('/getAllUsers',(req:Request,res:Response)=>{
    userController.handleGetAll(req,res);
})


router.get('/logOut',(req:Request,res:Response)=>{
    userController.handleLogOut(req,res)
})

router.post('/login',(req:Request,res:Response)=>{
    userController.handleLogIn(req,res);
})


router.get('/validate',(req:Request,res:Response)=>{
    userController.validateToken(req,res);
})

router.get('/validateSuperuser',(req:Request,res:Response)=>{
    userController.validateSuperUser(req,res);
})

router.post('/completeSign',(req:Request,res:Response)=>{
    userController.completeSign(req,res);
});

router.get('/returnCookies', (req:Request,res:Response)=>{
    userController.returnCookies(req,res);
})

router.get('/getLocalStorage',(req:Request,res:Response)=>{
    userController.getUserDataToLocalStorage(req,res);
})

router.get('/getAllCompany',(req:Request,res:Response)=>{
    companyControler.getAllCompany(req,res);
})

router.get('/getActiveUsersCompany',(req:Request,res:Response)=>{
    userController.activeUsersInCompany(req,res);
});
router.get('/getOffUsersCompany',(req:Request,res:Response)=>{
    userController.offUsersInCompany(req,res);
})

router.post('/changeStatus',(req:Request,res:Response)=>{
    userController.changeStatus(req,res);
})
router.post('/updateRole',(req:Request,res:Response)=>{
    userController.updateRole(req,res);
})
router.get('/companyUsers',(req:Request,res:Response)=>{
    userController.getCompanyUsers(req,res);
})



export {router};