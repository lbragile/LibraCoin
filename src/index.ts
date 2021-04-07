import * as crypto from "crypto";
import { Wallet } from "./wallet";

const user = new Wallet();
user.sendMoney(5, "0");
