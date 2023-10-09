import React, { useState } from "react";
import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Card,
  CardContent,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Grid,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff, Close } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CryptoJS from "crypto-js";
import emailjs from "emailjs-com";

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    showPassword: false,
  });

  const [forgotPasswordDialogOpen, setForgotPasswordDialogOpen] =
    useState(false);
  const [forgotPasswordFormData, setForgotPasswordFormData] = useState({
    magicWord: "",
    email: "",
    mobileNumber: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const togglePasswordVisibility = () => {
    setFormData({
      ...formData,
      showPassword: !formData.showPassword,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://localhost:7095/api/Auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem("token", token);
        localStorage.setItem("loggedInUserEmail", formData.email); // Store the email in localStorage

        // Fetch the user details
        const userResponse = await fetch("https://localhost:7095/api/Auth/users");
        if (userResponse.ok) {
          const users = await userResponse.json();
          const matchedUser = users.find((user) => user.email === formData.email);

          if (matchedUser) {
            const { status, id } = matchedUser;

            if (status === "Inactive") {
              toast.error("User is Inactive. Please contact the admin.");
              return;
            }

            // Update the token with user role
            const role = matchedUser.role;
            const tokenPayload = parseJwt(token);
            tokenPayload.role = role;
            const updatedToken = generateJwtToken(tokenPayload);
            localStorage.setItem("token", updatedToken);

            // Store the role and doctor's ID in localStorage
            localStorage.setItem("loggedInUserRole", role);
            localStorage.setItem("loggedInDoctorId", id);

            // Redirect based on the matched user role
            switch (role) {
              case "ADMIN":
                navigate("/admin");
                break;
              case "DOCTOR":
                navigate("/doctor");
                break;
              case "PATIENT":
                navigate("/patient");
                break;
              default:
                navigate("/login");
            }

            toast.success("Login successful");
            return;
          }
        }
      } else {
        if (response.status === 400) {
          toast.error("Invalid email or password");
        } else {
          toast.error("Login failed. Please try again later.");
        }
      }
    } catch (error) {
      toast.error("An error occurred");
      console.error("Error:", error);
    }
  };

  // Helper function to parse JWT token
  const parseJwt = (token) => {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join("")
    );

    return JSON.parse(jsonPayload);
  };

  // Helper function to generate JWT token
  const generateJwtToken = (payload) => {
    const header = {
      alg: "HS256",
      typ: "JWT",
    };

    const base64Header = btoa(JSON.stringify(header));
    const base64Payload = btoa(JSON.stringify(payload));
    const signature = `${base64Header}.${base64Payload}`;
    const secret = "Secret";
    const signatureHash = CryptoJS.HmacSHA256(signature, secret).toString(
      CryptoJS.enc.Base64
    );
    const token = `${signature}.${signatureHash}`;

    return token;
  };

  const handleForgotPasswordClick = () => {
    setForgotPasswordDialogOpen(true);
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://localhost:7095/api/Auth/users");
      if (response.ok) {
        const users = await response.json();
        const matchedUser = users.find(
          (user) =>
            user.mobileNumber === forgotPasswordFormData.mobileNumber &&
            user.magicWord === forgotPasswordFormData.magicWord
        );

        if (matchedUser) {
          const { password, email } = matchedUser;

          // Send password via email using EmailJS
          const templateParams = {
            to_email: email,
            password: password,
            receiver_email: forgotPasswordFormData.email,
            mobile_number: forgotPasswordFormData.mobileNumber,
          };

          // Use your EmailJS service ID and template ID
          const serviceId = "service_mrv60om";
          const templateId = "template_dzsesbc";
          const userId = "NWVqgTqbhm7k38nrA";

          emailjs.send(serviceId, templateId, templateParams, userId).then(
            (result) => {
              console.log(result.text);
              toast.success("Password sent to your email");
            },
            (error) => {
              console.error(error);
              toast.error("Failed to send email");
            }
          );
        } else {
          toast.error("Wrong credentials");
        }
      } else {
        toast.error("Failed to fetch user data");
      }
    } catch (error) {
      toast.error("An error occurred");
      console.error("Error:", error);
    }

    setForgotPasswordDialogOpen(false);
    setForgotPasswordFormData({
      magicWord: "",
      email: "",
      mobileNumber: "",
    });
  };

  const handleForgotPasswordCancel = () => {
    setForgotPasswordDialogOpen(false);
    setForgotPasswordFormData({
      magicWord: "",
      email: "",
      mobileNumber: "",
    });
  };

  const handleClose = () => {
    navigate("/");
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Card>
        <CardContent>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h5" component="h2" gutterBottom>
                Login Form
              </Typography>
            </Grid>
            <Grid item>
              <IconButton onClick={handleClose}>
                <Close />
              </IconButton>
            </Grid>
          </Grid>
          <form onSubmit={handleSubmit}>
            <TextField
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              fullWidth
              margin="normal"
            />
            <TextField
              name="password"
              label="Password"
              type={formData.showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleInputChange}
              required
              fullWidth
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility}>
                      {formData.showPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Login
            </Button>
            <Box display="flex" justifyContent="flex-end" marginTop="1rem">
              <Link
                component="button"
                variant="body2"
                onClick={handleForgotPasswordClick}
              >
                Forgot Password?
              </Link>
            </Box>
          </form>
        </CardContent>
      </Card>
      <Dialog
        open={forgotPasswordDialogOpen}
        onClose={handleForgotPasswordCancel}
      >
        <DialogTitle>Forgot Password</DialogTitle>
        <form onSubmit={handleForgotPasswordSubmit}>
          <DialogContent>
            <TextField
              name="magicWord"
              label="Magic Word"
              type="text"
              value={forgotPasswordFormData.magicWord}
              onChange={(e) =>
                setForgotPasswordFormData({
                  ...forgotPasswordFormData,
                  magicWord: e.target.value,
                })
              }
              required
              fullWidth
              margin="normal"
              autoComplete="off"
            />
            <TextField
              name="email"
              label="Email"
              type="email"
              value={forgotPasswordFormData.email}
              onChange={(e) =>
                setForgotPasswordFormData({
                  ...forgotPasswordFormData,
                  email: e.target.value,
                })
              }
              required
              fullWidth
              margin="normal"
              autoComplete="off"
            />
            <TextField
              name="mobileNumber"
              label="Mobile Number"
              type="text"
              value={forgotPasswordFormData.mobileNumber}
              onChange={(e) =>
                setForgotPasswordFormData({
                  ...forgotPasswordFormData,
                  mobileNumber: e.target.value,
                })
              }
              required
              fullWidth
              margin="normal"
              autoComplete="off"
            />
          </DialogContent>
          <DialogActions>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
            <Button
              onClick={handleForgotPasswordCancel}
              variant="outlined"
              color="primary"
            >
              Cancel
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <ToastContainer />
    </Box>
  );
};

export default LoginForm;
