import { TwelveLabs } from "twelvelabs-js";
import dotenv from 'dotenv';
dotenv.config();

export const client = new TwelveLabs({ apiKey: process.env.TL_API_KEY });