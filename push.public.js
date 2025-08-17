import express from 'express'
import { cfg } from '../config/env.js'
const router = express.Router()
router.get('/public', (req,res)=> res.type('text/plain').send(cfg().vapid.pub||''))
router.get('/vapid', (req,res)=> res.type('text/plain').send(cfg().vapid.pub||''))
export default router
