import { authorModel } from "../../index.js";

export const createAuthorImplicit = async (authorData) => {
  if (!authorData || Object.keys(authorData).length === 0) {
    return "Author data is required";
  }

  if (!authorData.name) {
    return "Author name is required";
  }

  const result = await authorModel.insertOne(authorData);
  return {
    message: "Author inserted and collection created implicitly",
    insertedId: result.insertedId,
  };
};
