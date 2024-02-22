import { UploadOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { Form, Upload } from "antd";
import Title from "antd/es/typography/Title";

import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import ButtonFullWidth from "../../components/ButtonFullWidth";
import { FormItemInput } from "../../components/FormItemInput";
import ImagePreview from "../../components/ImagePreview";
import Loading from "../../components/Loading";
import * as Message from "../../components/Message";
import { updateUser } from "../../redux/slices/userSlice";
import * as UserService from "../../services/UserService";
import { getBase64 } from "../../utils/helper";

const StyledProfile = styled.div`
  border: 1px solid #ccc;
  width: 480px;
  margin: 40px auto 0;
  padding: 20px;
  border-radius: 8x;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.8);
`;

const StyledUploadForm = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const StyledUpload = styled(Upload)`
  & .ant-upload-list-item-actions.picture {
    display: none;
  }
`;

function Profile() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [avatar, setAvatar] = useState("");

  const mutation = useMutation({
    mutationFn: (data) => {
      const { id, access_token, ...rests } = data;
      return UserService.updateUser(id, rests, access_token);
    },
  });

  const { data, isPending, isSuccess, mutate } = mutation;

  const handleGetDetailsUser = useCallback(
    async (id, token) => {
      const res = await UserService.getDetailsUser(id, token);
      dispatch(updateUser({ ...res?.data, access_token: token }));
    },
    [dispatch]
  );

  useEffect(() => {
    setName(user?.name);
    setEmail(user?.email);
    setPhone(user?.phone);
    setAddress(user?.address);
    setCity(user?.city);
    setAvatar(user?.avatar);
  }, [user]);

  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      Message.success();
      handleGetDetailsUser(user?.id, user?.access_token);
    } else if (isSuccess && data?.status === "ERR") {
      Message.error();
    }
  }, [isSuccess, handleGetDetailsUser, user, data]);

  async function handleUpload({ fileList }) {
    const file = fileList[0];
    if (file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      setAvatar(file.preview);
    }
  }

  function handleFinish(e) {
    e.preventDefault();
    mutate({
      id: user?.id,
      name,
      email,
      phone,
      address,
      city,
      avatar,
      access_token: user?.access_token,
    });
  }

  return (
    <StyledProfile>
      <Form onFinish={handleFinish} layout="horizontal" labelCol={{ span: 4 }}>
        <Title level={4} style={{ textAlign: "center" }}>
          User Info
        </Title>

        <FormItemInput
          label="Name"
          value={name}
          disabled={isPending}
          onChange={(e) => setName(e.target.value)}
        />
        <FormItemInput
          label="Email"
          value={email}
          disabled={isPending}
          onChange={(e) => setEmail(e.target.value)}
        />

        <FormItemInput
          label="Phone"
          value={phone}
          disabled={isPending}
          onChange={(e) => setPhone(e.target.value)}
        />

        <FormItemInput
          label="Address"
          value={address}
          disabled={isPending}
          onChange={(e) => setAddress(e.target.value)}
        />

        <FormItemInput
          label="City"
          value={city}
          disabled={isPending}
          onChange={(e) => setCity(e.target.value)}
        />

        <Form.Item label="Avatar">
          <StyledUploadForm>
            <StyledUpload
              action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
              onChange={handleUpload}
              maxCount={1}
            >
              <ButtonFullWidth height="60px" ghost icon={<UploadOutlined />}>
                Select photo
              </ButtonFullWidth>
            </StyledUpload>
            {avatar && <ImagePreview size={60} border="none" src={avatar} />}
          </StyledUploadForm>
        </Form.Item>

        <Form.Item>
          <Loading isPending={isPending}>
            <ButtonFullWidth disabled={isPending}>Submit</ButtonFullWidth>
          </Loading>
        </Form.Item>
      </Form>
    </StyledProfile>
  );
}

export default Profile;
