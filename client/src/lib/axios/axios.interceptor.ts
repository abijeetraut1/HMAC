import axios from "axios";

const KEY = "abcdefghijklmnopqrstuvwzyz123412";

// Import the AES key once
const cryptoKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(KEY),
    { name: "AES-GCM" },
    false,
    ["decrypt"]
);

function base64ToBytes(base64: string): Uint8Array {
    return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
}

const axiosInstance = axios.create({
    baseURL: "https://crispy-eureka-pwxg4q7xwg4cr96v-3000.app.github.dev/",
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.response.use(
    async (response) => {
        const { data, iv, tag } = response.data;

        const ciphertext = base64ToBytes(data);
        const ivBytes = base64ToBytes(iv);
        const tagBytes = base64ToBytes(tag);

        const encrypted = new Uint8Array(ciphertext.length + tagBytes.length);
        encrypted.set(ciphertext);
        encrypted.set(tagBytes, ciphertext.length);

        const decrypted = await crypto.subtle.decrypt(
            { name: "AES-GCM", iv: ivBytes },
            cryptoKey,
            encrypted
        );

        response.data = JSON.parse(new TextDecoder().decode(decrypted));

        return response;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;