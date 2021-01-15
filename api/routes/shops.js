// const config = require("../config");
const { Router } = require("express");
const router = Router();

// Initialize Controller
import {exchange_rates, goods} from '../controllers/shopsController'

router.get('/shops/exchange',exchange_rates)
router.get('/shop/goods',goods)
export default router;
