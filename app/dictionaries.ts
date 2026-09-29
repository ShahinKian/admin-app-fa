import "server-only";

const dictionaries = {
  fa: () => import("./dictionaries/fa.json").then((module) => module.default),
};

export const getDictionary = async () => {
  return dictionaries.fa();
};
