const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, "0"); // Ensure two digits
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export default formatDate;