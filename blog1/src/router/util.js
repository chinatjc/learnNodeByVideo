const { SuccessModel, ErrorModel } = require('../model/resModel');

// 处理返回值
const handlerReturnData = (fn, queryObject) => {
	return fn(queryObject).then(({head, body}) => ({
		head,
		body: SuccessModel(body)
	})).catch(({head, body}) => ({
		head,
		body: ErrorModel(body)
	}));
};

module.exports = {
	handlerReturnData
};
