// const config = require("../config");
const { Router } = require("express");
const router = Router();

// Initialize Controller
import {exchange_rates, goods,resolve, shop} from '../controllers/shopsController'

router.get('/shops/exchange',exchange_rates)
router.get('/shop/goods',goods)
router.get('/shops/:id',shop)
router.get('/shop/resolve',resolve)
export default router;
