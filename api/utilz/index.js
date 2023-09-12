const isInputNotEmpty = (...inputs) => inputs.every((item) => item?.trim().length);

const getCurrentTime = () => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

const utilz = { isInputNotEmpty, getCurrentTime };

module.exports = utilz;
