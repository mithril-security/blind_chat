export async function getApiKey() {
    try {
        const response = await fetch("https://cloud.mithrilsecurity.io/api/apiKeys/chat", {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            // Parse the JSON response
            const data = await response.json();

            const apiKeyValue = data.value;

            return apiKeyValue;
        } else {
            // Handle errors
            console.error("API Key retrieval failed");
        }
    } catch (error) {
        // Handle network errors
        console.error("Network error", error);
    }
    return "";
}