import axios from "axios";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "")
    || "/api";
const apiClient = axios.create({
    baseURL: apiBaseUrl,
});
export async function getHeroSummaries(language) {
    const response = await apiClient.get(`/heroes`, {
        params: language ? { language } : undefined,
    });
    return response.data.heroes;
}
export async function getHeroDetail(heroId, language) {
    const response = await apiClient.get(`/heroes/${heroId}`, {
        params: language ? { language } : undefined,
    });
    return response.data.hero;
}
