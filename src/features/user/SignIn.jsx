import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { FormItemInput } from "../../components/FormItemInput";
import * as Message from "../../components/Message";

import { UserFormLogin } from "../../components/UserFormLogin";
import { useMutationHook } from "../../hooks/useMutationHook";
import { updateUser } from "../../redux/slices/userSlice";
import * as UserService from "../../services/UserService";

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
      const storage = localStorage.getItem("refresh_token");
      const refreshToken = JSON.parse(storage);

      const res = await UserService.getDetailsUser(id, token);
      dispatch(updateUser({ ...res?.data, access_token: token, refreshToken }));
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
      Message.success("Log In Successfully");
      localStorage.setItem("access_token", JSON.stringify(data?.access_token));
      localStorage.setItem(
        "refresh_token",
        JSON.stringify(data?.refresh_token)
      );
      if (data?.access_token) {
        const decoded = jwtDecode(data?.access_token);
        if (decoded?.id) {
          handleGetDetailsUser(decoded?.id, data?.access_token);
        }
      }
    } else if (isSuccess && data?.status === "ERR") {
      Message.error("Login failed");
    }
  }, [isSuccess, navigate, data, handleGetDetailsUser, location]);

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
      text="Log In"
      data={data}
      onNavigate="/sign-up"
      spanLink="No account?"
      textLink="  Register"
    >
      <FormItemInput
        name="email"
        value="email"
        prefix={<UserOutlined />}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isPending}
        placeholder="Enter email"
      />
      <FormItemInput
        name="password"
        value="password"
        type="password"
        prefix={<LockOutlined />}
        onChange={(e) => setPassword(e.target.value)}
        disabled={isPending}
        placeholder="Enter password"
      />
      <p>admin@gmail.com</p>
      <p>admin</p>
    </UserFormLogin>
  );
}

export default SignIn;
