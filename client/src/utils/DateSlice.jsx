export const dateSlice = async (targetDate) => {
  const newDateOnly = await targetDate.toISOString().split("T")[0];

  return newDateOnly;
};
