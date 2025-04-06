import React, { useState, useContext } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
    ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API } from "../api/api";
import { AuthContext } from "../components/context/AuthContext";

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useContext(AuthContext);

    const handleLogin = async () => {
        if (!email || !password) {
            setMessage("Vui lòng nhập đầy đủ Email và Mật khẩu");
            return;
        }

        setIsLoading(true);
        setMessage("");

        try {
            const res = await API.post("/auth/login", {
                email: email.trim().toLowerCase(),
                password: password.trim(),
            });

            if (res.data.token) {
                await login(email, res.data.token); // Truyền cả email và token
                setMessage("Đăng nhập thành công!");
            } else {
                setMessage("Không nhận được token từ server.");
            }
        } catch (err) {
            const errorMsg =
                err.response?.data?.error ||
                err.response?.data?.message ||
                "Lỗi đăng nhập không xác định";
            setMessage(errorMsg);
            console.error("Login error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ImageBackground
            source={require("../assets/images/antman.jpg")}
            style={styles.bg}
            resizeMode="cover"
        >
            <View style={styles.overlay}>
                <Text style={styles.logo}>M-FLIX</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#aaa"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#aaa"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                <TouchableOpacity
                    style={styles.loginBtn}
                    onPress={handleLogin}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.loginText}>Sign In</Text>
                    )}
                </TouchableOpacity>

                <Text style={styles.orBtn}>
                    or press below button if don't have account
                </Text>

                <TouchableOpacity
                    style={styles.fbBtn}
                    onPress={() => navigation.navigate("Register")}
                >
                    <Text style={styles.fbText}>Sign Up</Text>
                </TouchableOpacity>

                {message && (
                    <Text
                        style={[
                            styles.message,
                            {
                                color: message.includes("thành công")
                                    ? "green"
                                    : "red",
                            },
                        ]}
                    >
                        {message}
                    </Text>
                )}
            </View>
        </ImageBackground>
    );
}

// Giữ nguyên styles như cũ
const styles = StyleSheet.create({
    bg: {
        flex: 1,
        justifyContent: "center",
    },
    overlay: {
        backgroundColor: "rgba(0,0,0,0.7)",
        padding: 30,
        borderRadius: 10,
        margin: 20,
    },
    logo: {
        fontSize: 36,
        fontWeight: "bold",
        color: "red",
        marginBottom: 30,
        alignSelf: "center",
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: "#fff",
        marginBottom: 20,
        color: "white",
        fontSize: 16,
        paddingVertical: 8,
    },
    loginBtn: {
        backgroundColor: "red",
        paddingVertical: 12,
        borderRadius: 5,
        marginBottom: 10,
        justifyContent: "center",
        alignItems: "center",
        height: 50,
    },
    orBtn: {
        fontStyle: "italic",
        color: "#fff",
        opacity: 0.3,
        textAlign: "center",
        marginBottom: 5,
    },
    loginText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
        textAlign: "center",
    },
    fbBtn: {
        backgroundColor: "white",
        paddingVertical: 12,
        borderRadius: 5,
        marginBottom: 10,
    },
    fbText: {
        color: "black",
        fontWeight: "bold",
        fontSize: 16,
        textAlign: "center",
    },
    message: {
        marginTop: 15,
        textAlign: "center",
        fontSize: 14,
    },
});
