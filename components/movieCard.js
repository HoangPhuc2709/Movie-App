// MovieCard.js
import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { image185, fallbackMoviePoster } from "../api/moviedb";

export default function MovieCard({ item, onPress }) {
    return (
        <View style={styles.card}>
            <TouchableOpacity
                onPress={onPress}
                style={styles.touchable}
                activeOpacity={0.7}
            >
                <Image
                    source={{
                        uri: image185(item.poster_path) || fallbackMoviePoster,
                    }}
                    style={styles.image}
                    resizeMode="cover"
                />
                <Text style={styles.title} numberOfLines={1}>
                    {item.title}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: 120, // Fixed width for consistency
        marginBottom: 16,
        alignItems: "center",
    },
    touchable: {
        width: "100%",
        alignItems: "center",
    },
    image: {
        width: 120,
        height: 180,
        borderRadius: 10,
        backgroundColor: "#ddd", // Shows if image fails to load
    },
    title: {
        marginTop: 8,
        width: "100%",
        textAlign: "center",
        fontSize: 14,
        fontWeight: "bold",
    },
});
