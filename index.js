const generateForm = document.querySelector(".generate-form");
const imageGallery = document.querySelector(".image-gallery");

let isImageGenerating = false;

const UNSPLASH_ACCESS_KEY = "nducI70gq4-6v3ypPMOAPReVKB_OSkHbSIUNtEN1LHA"; // Replace with your Unsplash Access Key

const updateImageCard = (imgDataArray) => {
    imageGallery.innerHTML = ''; // Clear previous images

    imgDataArray.forEach((imgObject) => {
        const imgCard = document.createElement("div");
        imgCard.classList.add("img-card");

        const imgElement = document.createElement("img");
        imgElement.src = imgObject.urls.small;
        imgElement.alt = imgObject.alt_description || "Unsplash image";

        const downloadBtn = document.createElement("a");
        downloadBtn.href = imgObject.urls.full;
        downloadBtn.download = `${new Date().getTime()}.jpg`;
        downloadBtn.innerHTML = `<img src="images/download.svg" alt="Download icon">`;
        downloadBtn.classList.add("download-btn");

        imgCard.appendChild(imgElement);
        imgCard.appendChild(downloadBtn);
        imageGallery.appendChild(imgCard);
    });
};

const searchUnsplashImages = async (query, imgQuantity) => {
    try {
        const url = `https://api.unsplash.com/search/photos?query=${query}&per_page=${imgQuantity}&client_id=${UNSPLASH_ACCESS_KEY}`;
        const response = await fetch(url);

        if (!response.ok) {
            const errorResponse = await response.json();
            console.error("API Error Response:", errorResponse);
            throw new Error(`Failed to fetch images! ${errorResponse.errors.join(', ')}`);
        }

        const data = await response.json(); // Get data from the response
        updateImageCard(data.results);
    } catch (error) {
        console.error("Error:", error);
        alert(error.message);
    } finally {
        isImageGenerating = false;
    }
};

const handleFormSubmission = (e) => {
    e.preventDefault();
    if (isImageGenerating) return;
    isImageGenerating = true;

    // Get user input and image quantity values from the form
    const userPrompt = e.target.querySelector(".prompt-input").value;
    const userImgQuantity = e.target.querySelector(".img-quantity").value;

    // Creating HTML markup for image cards with loading state
    const imgCardMarkup = Array.from({ length: userImgQuantity }, () =>
        `<div class="img-card loading">
            <img src="images/loader.svg" alt="Loading">
            <a href="#" class="download-btn">
                <img src="images/download.svg" alt="Download icon">
            </a>
        </div>`
    ).join("");

    imageGallery.innerHTML = imgCardMarkup;
    searchUnsplashImages(userPrompt, userImgQuantity);
};

generateForm.addEventListener("submit", handleFormSubmission);
