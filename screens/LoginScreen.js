import React, { useState, useContext } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
} from "react-native";
import { API } from "../api/api";
import { AuthContext } from "../components/context/AuthContext";

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const { login } = useContext(AuthContext);

    const handleLogin = async () => {
        if (!email || !password) {
            setMessage("Vui lòng nhập đầy đủ Email và Mật khẩu");
            return;
        }

        try {
            const res = await API.post("/auth/login", { email, password });

            if (res.data.token && res.data.user?.email) {
                await login(res.data.token, res.data.user.email);
            } else {
                setMessage("Dữ liệu đăng nhập không hợp lệ từ server");
            }
        } catch (err) {
            setMessage(
                err.response?.data?.error ||
                    err.response?.data?.message ||
                    "Lỗi đăng nhập không xác định"
            );
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
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#aaa"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
                    <Text style={styles.loginText}>Sign In</Text>
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
                {message && <Text style={styles.message}>{message}</Text>}
            </View>
        </ImageBackground>
    );
}

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
        color: "red",
        textAlign: "center",
    },
});
