import kvConst from '../const/kv-const';
import constant from '../const/constant';
import dayjs from 'dayjs';

const authStore = {
	async put(c, userId, authInfo) {
		const expiresAt = dayjs().add(constant.TOKEN_EXPIRE, 'second').format('YYYY-MM-DD HH:mm:ss');
		const key = kvConst.AUTH_INFO + userId;
		await c.env.db.prepare(
			'INSERT OR REPLACE INTO _auth_session (key, value, expires_at) VALUES (?, ?, ?)'
		).bind(key, JSON.stringify(authInfo), expiresAt).run();
	},

	async getJson(c, userId) {
		const row = await c.env.db.prepare(
			'SELECT value FROM _auth_session WHERE key = ?'
		).bind(kvConst.AUTH_INFO + userId).first();
		return row ? JSON.parse(row.value) : null;
	},

	async delete(c, userId) {
		await c.env.db.prepare(
			'DELETE FROM _auth_session WHERE key = ?'
		).bind(kvConst.AUTH_INFO + userId).run();
	}
};

export default authStore;
