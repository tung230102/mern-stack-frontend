import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { FormItemInput } from "../../components/FormItemInput";
import * as Message from "../../components/Message";

import { useMutationHook } from "../../hooks/useMutationHook";
import { updateUser } from "../../redux/slices/userSlice";
import * as UserService from "../../services/UserService";
import { UserFormLogin } from "../../components/UserFormLogin";

function SignIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const location = useLocation();

  const mutation = useMutationHook((data) => UserService.loginUser(data));
  const { data, isPending, isSuccess } = mutation;

  const handleGetDetailsUser = useCallback(
    async (id, token) => {
      const res = await UserService.getDetailsUser(id, token);
      dispatch(updateUser({ ...res?.data, access_token: token }));
    },
    [dispatch]
  );

  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      if (location?.state) {
        navigate(location?.state);
      } else {
        navigate("/");
      }
      Message.success();
      localStorage.setItem("access_token", JSON.stringify(data?.access_token));
      if (data?.access_token) {
        const decoded = jwtDecode(data?.access_token);
        if (decoded?.id) {
          handleGetDetailsUser(decoded?.id, data?.access_token);
        }
      }
    } else if (isSuccess && data?.status === "ERR") {
      Message.error();
    }
  }, [isSuccess, navigate, data, handleGetDetailsUser]);

  const handleFinish = () => {
    mutation.mutate({
      email,
      password,
    });
  };

  return (
    <UserFormLogin
      onFinish={handleFinish}
      isPending={isPending}
      text="Đăng nhập"
      data={data}
      onNavigate="/sign-up"
      spanLink="Chưa có tài khoản?"
      textLink=" Đăng ký"
    >
      <FormItemInput
        name="email"
        value="email"
        prefix={<UserOutlined />}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isPending}
      />
      <FormItemInput
        name="password"
        value="password"
        type="password"
        prefix={<LockOutlined />}
        onChange={(e) => setPassword(e.target.value)}
        disabled={isPending}
      />
      <p>test@gmail.com</p>
      <p>password</p>
    </UserFormLogin>
  );
}

export default SignIn;
