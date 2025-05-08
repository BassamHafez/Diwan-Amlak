exports.formatSaudiNumber = (number) => {
  if (number.startsWith("05")) {
    return "966" + number.slice(1);
  }

  return number;
};
