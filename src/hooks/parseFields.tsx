export const parseFields = (field1: string) => {
  const result: any = {};

  const parts = field1.split(",");

  result.field1 = parts[0];

  parts.slice(1).forEach((item) => {
    const [key, value] = item.split("=");
    result[key] = value?.replace(/"/g, "");
  });

  return result;
};
