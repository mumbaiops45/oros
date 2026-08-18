import api, { unwrap } from "@/lib/axios";
import { AUTH } from "./endpoints";

/** Admin panel — email + password, no OTP. */
export const adminLogin = (email, password) =>
  api.post(AUTH.adminLogin, { email, password }).then(unwrap);

/** Whoever the stored bearer token belongs to. */
export const fetchMe = () => api.get(AUTH.me).then(unwrap);

/* Storefront customer flow — phone + OTP. */

export const register = (payload) =>
  api.post(AUTH.register, payload).then(unwrap);

export const verifyRegisterOtp = (payload) =>
  api.post(AUTH.registerVerify, payload).then(unwrap);

export const login = (phone) => api.post(AUTH.login, { phone }).then(unwrap);

export const verifyLoginOtp = (phone, otp) =>
  api.post(AUTH.loginVerify, { phone, otp }).then(unwrap);
