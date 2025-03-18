import React, { useEffect, useState } from "react";
import { Form, Input, Button, Modal, message } from "antd";
import { UserService } from "../users/services/user.service";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useLocation } from "react-router-dom";
import { UserLoginInterface } from "../users/interfaces/UserInterface";
import { validateName } from "../users/hooks/useUserValidators";
import { FacebookFilled } from "@ant-design/icons";
import "../../styles/authFormStyles.css";

const Login: React.FC = () => {
  const [user, setUser] = useState<UserLoginInterface>({
    emailOrUsername: "",
    password: "",
  });
  const [isVerificationModalVisible, setIsVerificationModalVisible] =
    useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(decoded));

        let returnUrl = params.get("returnUrl") || "/";
        if (returnUrl.includes("/login")) {
          returnUrl = "/";
        }
        navigate(returnUrl, { replace: true });
      } catch (error) {
        console.error("Failed to process Facebook login");
      }
    }
  }, [location, navigate]);

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (values: UserLoginInterface) => {
    try {
      const abortController = new AbortController();
      const response = await UserService.loginUser(
        values,
        abortController.signal
      );

      if (response) {
        const decoded = jwtDecode(response);

        localStorage.setItem("token", response);
        localStorage.setItem("user", JSON.stringify(decoded));

        const params = new URLSearchParams(location.search);
        let returnUrl = params.get("returnUrl") || "/";
        if (returnUrl.includes("/login")) {
          returnUrl = "/";
        }
        navigate(returnUrl, { replace: true });
      }
    } catch (error: any) {
      if (error.status === 409) {
        if (error.response.data == "User email is not verified!") {
          setIsVerificationModalVisible(true);
        } else {
          message.error(error.response?.data || "Login failed");
        }
      }
    }
  };

  const handleResendVerification = async () => {
    try {
      const abortController = new AbortController();
      await UserService.resendVerificationEmail(
        user.emailOrUsername,
        abortController.signal
      );
      Modal.success({
        title: "Verification Email Resent",
        content:
          "A new verification email has been sent to your email address. Please check your inbox (and spam/junk folder if necessary).",
      });
    } catch (error: any) {
      message.error("Failed to resend verification email");
    }
  };

  const handleFacebookLogin = () => {
    const returnUrl = `${window.location.origin}/login`;
    UserService.initiateFacebookLogin(returnUrl);
  };

  return (
    <div>
      <div className="auth-container">
        <Form onFinish={handleSubmit} layout="vertical" className="auth-form">
          <Form.Item
            label="Username or Email"
            name="emailOrUsername"
            rules={[{ validator: validateName }]}
          >
            <Input
              type="text"
              value={user.emailOrUsername}
              onChange={handleUserChange}
              name="emailOrUsername"
            />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              id="password-auth"
              value={user.password}
              onChange={handleUserChange}
              name="password"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="submit-button">
              Login
            </Button>
          </Form.Item>
          <div className="or-separator">
            <hr className="or-line" />
            <p className="or-text">or</p>
            <hr className="or-line" />
          </div>
          <Form.Item>
            <Button
              icon={<FacebookFilled />}
              className="submit-button facebook-button"
              onClick={handleFacebookLogin}
              block
            >
              Login with Facebook
            </Button>
          </Form.Item>
        </Form>
      </div>

      <Modal
        className="verification-modal"
        title="Email Verification Required"
        open={isVerificationModalVisible}
        onOk={() => setIsVerificationModalVisible(false)}
        onCancel={() => setIsVerificationModalVisible(false)}
        footer={[
          <Button
            key="resend"
            type="primary"
            onClick={handleResendVerification}
          >
            Resend Verification Email
          </Button>,
          <Button
            type="default"
            key="ok"
            onClick={() => setIsVerificationModalVisible(false)}
          >
            OK
          </Button>,
        ]}
      >
        <p>
          Please verify your email before logging in. A verification email has
          been sent to {user.emailOrUsername}. Check your inbox (and spam/junk
          folder) and click the link to verify.
        </p>
      </Modal>
    </div>
  );
};

export default Login;
