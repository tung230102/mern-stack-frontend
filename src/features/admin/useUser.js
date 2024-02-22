import { useQuery } from "@tanstack/react-query";

import * as UserService from "../../services/UserService";
import { useSelector } from "react-redux";

function useUser() {
  const user = useSelector((state) => state?.user);

  const getAllUsers = async () => {
    const res = await UserService.getAllUser(user?.access_token);
    return res;
  };

  const queryUser = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  return queryUser;
}

export default useUser;
