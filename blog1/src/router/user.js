const { login } = require('../controller/user');
const { redisSet } = require('../db/redis');
const { SuccessModel, ErrorModel } = require('../model/resModel');

const map = {
	POST: {
		'/api/user/login'(req, res) {
			return login(req.body).then(({ username, password, body }) => {

				// 登录成功，同步至redis
				redisSet(req.sessionId, { username, password });

				const head = {
					options: {
						'set-cookie': `sessionId=${req.sessionId}\; Expires=${new Date(new Date().setHours(new Date().getHours() + 24)).toGMTString()}\; Path=/; httpOnly`
					}
				};

				return {
					head,
					body: SuccessModel(body)
				}
			}).catch(({head, body}) => ({
				head,
				body: ErrorModel(body)
			}));
		}
	}
};

module.exports = map;
