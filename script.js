document.getElementById("GenerateBtn").addEventListener("click", async function () {
  let token = "";
  let input = document.getElementById("textInput").value.toLowerCase().trim(); // Get input from user
  let imageContainer = document.getElementById("imageContainer");

  // Function to generate image (API)
  async function generateImage(data) {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/ZB-Tech/Text-to-Image",
      {
        headers: { Authorization: `Bearer ${token}` },
        method: "POST",
        body: JSON.stringify({ inputs: data }),
      }
    );

    if (!response.ok) {
      throw new Error("API error");
    }

    const result = await response.blob(); 
    return result;
  }

  // Function to get sample images
  function getSampleImage(prompt) {
    if (prompt.includes("cat")) return "images/cat.jpeg";
    if (prompt.includes("dog")) return "images/dog.jpeg";
    if (prompt.includes("scenery")) return "images/scenery.jpeg";
    return "images/default.jpeg";
  }

  try {
    // Try API first
    let imageBlob = await generateImage(input);
    let imageUrl = URL.createObjectURL(imageBlob);

    imageContainer.innerHTML = `<img src="${imageUrl}" class="mx-auto rounded-lg shadow-lg" />`;

    addDownloadButton(imageUrl);

  } catch (error) {
    console.warn("API failed, using sample images instead:", error);

    // Fallback: sample images
    let imagePath = getSampleImage(input);

    imageContainer.innerHTML = `<img src="${imagePath}" class="mx-auto rounded-lg shadow-lg" />`;

    addDownloadButton(imagePath);
  }

  // Reusable download button function
  function addDownloadButton(src) {
    const downloadBtn = document.createElement("button");
    downloadBtn.textContent = "Download Image";
    downloadBtn.classList.add(
      "w-full","bg-blue-500","rounded-lg","px-6","mt-4","py-2","text-white"
    );

    downloadBtn.addEventListener("click", function () {
      const link = document.createElement("a");
      link.href = src;
      link.download = "generated-image.png";
      link.click();
    });

    imageContainer.appendChild(downloadBtn);
  }
});
