import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    StyleSheet,
    Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { fetchUpcomingMovies } from "../api/moviedb";
import { image185 } from "../api/moviedb";
import { Bars3CenterLeftIcon } from "react-native-heroicons/outline";
import Loading from "../components/loading";

const { width } = Dimensions.get("window");

export default function UpcomingScreen() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        const loadMovies = async () => {
            try {
                const data = await fetchUpcomingMovies();
                if (data?.results) setMovies(data.results);
            } catch (error) {
                console.error("Failed to fetch upcoming movies:", error);
            } finally {
                setLoading(false);
            }
        };
        loadMovies();
    }, []);

    if (loading) return <Loading />;

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Bars3CenterLeftIcon
                        size={40}
                        strokeWidth={2}
                        color="red"
                    />
                </TouchableOpacity>
                <Text style={styles.title}>Phim Sắp Chiếu</Text>
            </View>

            {/* Danh sách phim */}
            {movies.length > 0 ? (
                movies.map((item) => (
                    <View key={item.id} style={styles.movieItem}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("Movie", item)}
                            style={styles.movieContent}
                        >
                            <Image
                                source={{ uri: image185(item.poster_path) }}
                                style={styles.movieImage}
                            />
                            <View style={styles.movieInfo}>
                                <Text style={styles.movieTitle}>
                                    {item.title}
                                </Text>
                                <Text style={styles.movieDate}>
                                    {item.release_date ||
                                        "Chưa có ngày công chiếu"}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                ))
            ) : (
                <Text style={styles.emptyText}>Không có phim sắp chiếu</Text>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0f172a",
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    title: {
        color: "white",
        fontSize: 24,
        fontWeight: "bold",
        marginLeft: 20,
    },
    movieItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
        backgroundColor: "#1e293b",
        borderRadius: 10,
        padding: 10,
    },
    movieContent: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    movieImage: {
        width: 80,
        height: 120,
        borderRadius: 8,
    },
    movieInfo: {
        flex: 1,
        marginLeft: 12,
    },
    movieTitle: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 4,
    },
    movieDate: {
        color: "#94a3b8",
        fontSize: 14,
    },
    emptyText: {
        color: "white",
        textAlign: "center",
        marginTop: 50,
        fontSize: 16,
    },
});
