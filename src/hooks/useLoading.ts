import { useState } from "react";
export const useLoading = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const turnOnLoading = () => {
    setLoading(true);
  };

  const turnOffLoading = () => {
    setLoading(false);
  };

  return { loading, turnOnLoading, turnOffLoading };
};
