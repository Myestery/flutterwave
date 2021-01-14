// const config = require("../config");
const { Router } = require("express");
const router = Router();

// Initialize Controller
import {exchange_rates} from '../controllers/shopsController'

router.get('/shops/exchange',exchange_rates)

export default router;
