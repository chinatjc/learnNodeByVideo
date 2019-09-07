const SuccessModel = ({ data, msg='' } = {}) => ({
	data,
	msg,
	errno: 0
});

const ErrorModel = ({ msg = '' } = {}) => ({
	msg,
	errno: 1
});

module.exports = {
	SuccessModel,
	ErrorModel
};
