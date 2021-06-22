import * as yup from "yup";
import { StringSchema } from "yup";
import { RequiredNumberSchema } from "yup/lib/number";
import { RequiredStringSchema } from "yup/lib/string";
import { numberWithCommas } from "../utils/numberManipulation";

type reqStrSchema = RequiredStringSchema<string | undefined, Record<string, unknown>>;
type optStrSchema = StringSchema<string | undefined, Record<string, unknown>>;
type reqNumSchema = RequiredNumberSchema<number | undefined, Record<string, unknown>>;

type TSignSchema = {
  to: reqStrSchema;
  amount: reqNumSchema;
  msg: optStrSchema;
};

const minVal = (min: number, value?: number): boolean => (value === undefined ? true : value >= min);
const decimalFormat = (value?: number): boolean => {
  const num = Number(value);
  return Math.floor(num) === num || !value ? true : value.toString().split(".")[1].length <= 2;
};

export const SignSchema = (lenPK: number, balance: number): yup.ObjectSchema<TSignSchema> => {
  return yup.object().shape({
    to: yup
      .string()
      .min(lenPK, (obj) => {
        const diff = obj.min - obj.value.length;
        return `Length is too short. Add ${diff} alphanumeric character${diff === 1 ? "" : "s"}`;
      })
      .max(lenPK, (obj) => {
        const diff = obj.value.length - obj.max;
        return `Length is too long. Remove ${diff} alphanumeric character${diff === 1 ? "" : "s"}`;
      })
      .matches(new RegExp(`[A-Za-z0-9]{${lenPK}}`), "Format is invalid, characters must be alphanumeric")
      .required("Receiver Public Key is required!"),
    amount: yup
      .number()
      .test("negative", "Cannot be a negative value", (value) => minVal(0, value))
      .test("min", "Must be at least $0.10 LC", (value) => minVal(0.1, value))
      .test("format", "Allowed at most 2 decimal places", decimalFormat)
      .max(balance, `Must be at most $${numberWithCommas(balance)} LC`)
      .required("Amount is required!"),
    msg: yup.string().optional()
  });
};
