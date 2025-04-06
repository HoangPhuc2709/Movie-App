// auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// Đăng ký
router.post("/register", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Kiểm tra email hợp lệ
        if (!email || !password) {
            return res
                .status(400)
                .json({ error: "Vui lòng cung cấp email và mật khẩu" });
        }

        // Kiểm tra email đã tồn tại
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email đã tồn tại" });
        }

        // Hash password
        const hashed = await bcrypt.hash(password, 10);

        // Tạo user mới
        const user = await User.create({
            email,
            password: hashed,
            createdAt: new Date(),
        });

        res.json({
            success: true,
            user: {
                email: user.email,
                createdAt: user.createdAt,
            },
        });
    } catch (e) {
        console.error("Registration error:", e);
        res.status(500).json({ error: "Lỗi server khi đăng ký" });
    }
});

// Đăng nhập
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Kiểm tra input
        if (!email || !password) {
            return res
                .status(400)
                .json({ error: "Vui lòng cung cấp email và mật khẩu" });
        }

        // Tìm user
        const user = await User.findOne({ email });
        if (!user) {
            return res
                .status(400)
                .json({ error: "Email hoặc mật khẩu không đúng" });
        }

        // So sánh mật khẩu
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res
                .status(400)
                .json({ error: "Email hoặc mật khẩu không đúng" });
        }

        // Tạo token
        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        res.json({
            success: true,
            token,
            user: {
                email: user.email,
                createdAt: user.createdAt,
            },
        });
    } catch (e) {
        console.error("Login error:", e);
        res.status(500).json({ error: "Lỗi server khi đăng nhập" });
    }
});

module.exports = router;
