import * as yup from "yup";
import { StringSchema } from "yup";
import { RequiredNumberSchema } from "yup/lib/number";
import { RequiredStringSchema } from "yup/lib/string";

function numberWithCommas(x: number): string {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

type reqStrSchema = RequiredStringSchema<string | undefined, Record<string, unknown>>;
type optStrSchema = StringSchema<string | undefined, Record<string, unknown>>;
type reqNumSchema = RequiredNumberSchema<number | undefined, Record<string, unknown>>;

export const SignSchema = (
  lenPK: number,
  balance: number
): yup.ObjectSchema<{
  from: reqStrSchema;
  to: reqStrSchema;
  amount: reqNumSchema;
  msg: optStrSchema;
  fromSK: reqStrSchema;
}> => {
  return yup.object().shape({
    from: yup.string().required(),
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
      .min(0)
      .max(balance, `Must be at most $${numberWithCommas(balance)} LC`)
      .positive("Cannot use negative values!")
      .required("Amount is required!"),
    msg: yup.string().optional(),
    fromSK: yup.string().required()
  });
};
