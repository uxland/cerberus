export const splitAndChooseDescription = (input, choice) => {
  const lastIndex = input.lastIndexOf('>');
  const description = {
    first: () => (lastIndex !== -1 ? input.substring(0, lastIndex) : ''),
    second: () => (lastIndex !== -1 ? input.substring(lastIndex + 1) : ''),
  };
  return description[choice] ? description[choice]() : '';
};
