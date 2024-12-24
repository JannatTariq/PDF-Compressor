async function(properties, context) {
    const serverUrl = properties.server; 
    const bearerToken = properties.authorization; 
    const task = properties.task; 
    let file = properties.file; 
    
    if (!serverUrl || !bearerToken || !task || !file) {
        throw new Error("Missing required properties: server_url, bearer_token, task, or file.");
    }

    if (typeof file === "string" && !/^https?:\/\//i.test(file)) {
        if (file.startsWith("//")) {
            file = `https:${file}`;
        } else {
            file = `https://${file}`;
        }
    }

    if (typeof file === "string") {
        console.log("Fetching file from URL...");
        const response = await fetch(file);
        if (!response.ok) {
            throw new Error(`Failed to fetch file: ${response.statusText}`);
        }
        file = await response.blob(); 
    }

    if (!(file instanceof Blob || file instanceof File)) {
        throw new Error("The file must be a Blob or File object.");
    }

    const uploadUrl = `https://${serverUrl}/v1/upload`;
    const formData = new FormData();
    formData.append("task", task);
    formData.append("file", file, "uploaded_file.pdf"); 

    try {
        const response = await fetch(uploadUrl, {
            method: "POST",
            headers: {
                "Authorization": bearerToken
            },
            body: formData
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            throw new Error(`HTTP error: ${response.status}. Message: ${errorDetails.message || "Unknown error"}`);
        }

        const data = await response.json();
        return {
            server_filename: data.server_filename || null
        };
    } catch (error) {
        console.error("Error uploading the file:", error);
        return {
            error: error.message,
            server_filename: null
        };
    }
}
