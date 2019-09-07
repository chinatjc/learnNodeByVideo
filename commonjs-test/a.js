const add = nums => nums.reduce((sum, num) => sum += num);

const mul = nums => nums.reduce((sum, num) => sum *= num);

module.exports = { add, mul };
