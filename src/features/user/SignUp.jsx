import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { FormItemInput } from "../../components/FormItemInput";
import * as Message from "../../components/Message";
import { UserFormLogin } from "../../components/UserFormLogin";
import { useMutationHook } from "../../hooks/useMutationHook";
import * as UserService from "../../services/UserService";

function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const mutation = useMutationHook((data) => UserService.signupUser(data));
  const { data, isPending, isSuccess } = mutation;

  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      Message.success();
      navigate("/sign-in");
    } else if (isSuccess && data?.status === "ERR") {
      Message.error();
    }
  }, [isSuccess, navigate, data]);

  const onFinish = () => {
    mutation.mutate({
      email,
      password,
      confirmPassword,
    });
  };

  return (
    <UserFormLogin
      onFinish={onFinish}
      isPending={isPending}
      text="Đăng ký"
      data={data}
      onNavigate="/sign-in"
      spanLink="Đã có tài khoản?"
      textLink=" Đăng nhập"
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
      <FormItemInput
        name="confirm password"
        value="confirm password"
        type="password"
        prefix={<LockOutlined />}
        onChange={(e) => setConfirmPassword(e.target.value)}
        disabled={isPending}
      />
    </UserFormLogin>
  );
}

export default SignUp;
