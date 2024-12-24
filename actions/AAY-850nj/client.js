function(properties, context) {
    const downloadUrl = `https://${properties.server}/v1/download/${properties.task}`;
    const bearerToken = properties.authorization;
     fetch(downloadUrl, {
        method: "GET",
        headers: {
            "Authorization": `${bearerToken}`
        }
    })
    .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.blob(); 
        })
        .then(blob => {
            const fileUrl = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = fileUrl;
            a.download = `${properties.filename}.pdf`; 
            document.body.appendChild(a);
            a.click(); 
            document.body.removeChild(a);
            URL.revokeObjectURL(fileUrl);
        })
        .catch(error => {
            console.error("Error downloading file:", error);
        });
}
