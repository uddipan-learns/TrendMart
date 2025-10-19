let allProducts = [];

// Fetch products from API
async function fetchProducts() {
  try {
    const response = await fetch("https://api.escuelajs.co/api/v1/products");
    const data = await response.json();
    allProducts = data.slice(0, 8);

    // Display the products
    displayProducts(allProducts);

    // Hide loading state
    document.getElementById("loadingState").style.display = "none";
  } catch (error) {
    console.error("Error fetching products:", error);
    document.getElementById("loadingState").innerHTML = `
            <i class="fas fa-exclamation-circle text-4xl text-red-600"></i>
            <p class="text-gray-600 mt-4">Failed to load products. Please try again later.</p>
        `;
  }
}

// Display products in the container
function displayProducts(products) {
  const container = document.getElementById("productsContainer");

  if (products.length === 0) {
    container.innerHTML = `
            <div class="col-span-full text-center py-12">
                <i class="fas fa-search text-4xl text-gray-400"></i>
                <p class="text-gray-600 mt-4">No products found matching your search.</p>
            </div>
        `;
    return;
  }

  container.innerHTML = products
    .map((product) => {
      let imageUrl =
        product.images && product.images.length > 0 ? product.images[0] : "";

      return `
        <div class="product-item relative bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300">
            <div class="h-48 overflow-hidden bg-gray-200 flex items-center justify-center">
                <img
                    src="${imageUrl}"
                    alt="${product.title}"
                    class="w-full h-full object-cover"
                    crossorigin="anonymous"
                    referrerpolicy="no-referrer"
                    onerror="this.style.display='none'; this.parentElement.innerHTML='<div class=\\'w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100\\'><i class=\\'fas fa-image text-4xl text-gray-400\\'></i></div>'"
                >
            </div>
            <div class="p-4">
                <h4 class="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">${product.title}</h4>
                <p class="text-2xl font-bold text-blue-600">$${product.price}</p>
                <button class="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition">
                    <i class="fas fa-cart-plus mr-2"></i>Add to Cart
                </button>
            </div>
        </div>
    `;
    })
    .join("");
}

// Search functionality
function searchProducts() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const filteredProducts = allProducts.filter((product) =>
    product.title.toLowerCase().includes(searchTerm)
  );
  displayProducts(filteredProducts);
}

// Browser Detection Function using navigator API
function detectBrowser() {
  const userAgent = navigator.userAgent;
  let browserName = "Unknown Browser";

  if (userAgent.indexOf("Firefox") > -1) {
    browserName = "Mozilla Firefox";
  } else if (
    userAgent.indexOf("Chrome") > -1 &&
    userAgent.indexOf("Edg") === -1
  ) {
    browserName = "Google Chrome";
  } else if (
    userAgent.indexOf("Safari") > -1 &&
    userAgent.indexOf("Chrome") === -1
  ) {
    browserName = "Apple Safari";
  } else if (userAgent.indexOf("Edg") > -1) {
    browserName = "Microsoft Edge";
  } else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
    browserName = "Opera";
  }

  document.getElementById("browserInfo").textContent = browserName;
}

// Location Detection Function
function detectLocation() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(2);
        const lon = position.coords.longitude.toFixed(2);
        document.getElementById(
          "locationInfo"
        ).textContent = `Lat: ${lat}, Lon: ${lon}`;
      },
      (error) => {
        document.getElementById("locationInfo").textContent =
          "Location access denied";
      }
    );
  } else {
    document.getElementById("locationInfo").textContent =
      "Geolocation not supported";
  }
}

// Handle Interest Form Submission
function handleFormSubmit(e) {
  e.preventDefault();

  const formData = {
    fullName: document.getElementById("fullName").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    interest: document.getElementById("interest").value,
    message: document.getElementById("message").value,
    newsletter: document.getElementById("newsletter").checked,
  };

  console.log("Form Data Submitted:", formData);

  // Show success message
  const messageDiv = document.getElementById("formMessage");
  messageDiv.className =
    "mt-4 text-center p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg";
  messageDiv.textContent =
    "Thank you for your interest! We will contact you soon.";
  messageDiv.classList.remove("hidden");

  // Reset form
  document.getElementById("interestForm").reset();

  // Hide message after 5 seconds
  setTimeout(() => {
    messageDiv.classList.add("hidden");
  }, 5000);
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  // Fetch products when page loads
  fetchProducts();

  // Detect browser and location
  detectBrowser();
  detectLocation();

  // Search button click
  document
    .getElementById("searchBtn")
    .addEventListener("click", searchProducts);

  // Reset search when input is cleared
  document.getElementById("searchInput").addEventListener("input", (e) => {
    if (e.target.value === "") {
      displayProducts(allProducts);
    }
  });

  // Interest form submission
  document
    .getElementById("interestForm")
    .addEventListener("submit", handleFormSubmit);
});
