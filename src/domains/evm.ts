import z from "zod";

export const EVMAddress = z
  .string()
  .regex(/^0x[a-fA-F0-9]{40}$/i)
  .brand<"EVMAddress">();
export type IEVMAddress = z.infer<typeof EVMAddress>;

export const EVMChainId = z.string().brand<"EVMChainId">();
export type IEVMChainId = z.infer<typeof EVMChainId>;

export const Connection = z.object({
  address: EVMAddress,
  chainId: EVMChainId,
});
export type IConnection = z.infer<typeof Connection>;
