// Mock user data
const users = [];

// Mock recipe data
const recipes = [];

// User registration
function registerUser(username, password) {
  const newUser = {
    id: users.length + 1,
    username,
    password,
    preferences: {
      dietaryRestrictions: "N/A",
      savedRecipes: [],
      preferredCuisines: [],
      allergies: [],
    },
  };
  users.push(newUser);
  return newUser;
}

// User login
function loginUser(username, password) {
  const user = users.find((u) => u.username === username && u.password === password);
  return user ? user : null;
}

// Save a recipe for a user
function saveRecipe(user, recipe) {
  if (!user.preferences.savedRecipes.includes(recipe)) {
    user.preferences.savedRecipes.push(recipe);
  }
}

// Rate and review a recipe
function rateRecipe(user, recipe, rating, review) {
  const userRating = {
    userId: user.id,
    value: rating,
    date: new Date().toISOString().split('T')[0],
    review,
  };

  recipe.ratings.push(userRating);

  // Calculate the average rating
  const totalRating = recipe.ratings.reduce((sum, r) => sum + r.value, 0);
  recipe.aveRating = totalRating / recipe.ratings.length;
}

// Set user preferences
function setUserPreferences(user, dietaryRestrictions, preferredCuisines, allergies) {
  user.preferences.dietaryRestrictions = dietaryRestrictions;
  user.preferences.preferredCuisines = preferredCuisines;
  user.preferences.allergies = allergies;
}

// Get personalized recipe recommendations
function getRecommendedRecipes(user) {
  // Implement logic to recommend recipes based on user preferences
  // and saved recipes history
  // Mocking recommendations for now
  return recipes.slice(0, 5);
}

var preferencesSubmitted = false;

function submitPreferences() {
  // Get user input values
  var dietaryRestrictions = document.getElementById('dietary-restrictions').value;
  var preferredCuisines = document.getElementById('preferred-cuisines').value;
  var allergies = document.getElementById('allergies').value;

  // Display the user's preferences below the form
  var preferencesDisplay = document.getElementById('preferences-display');
  preferencesDisplay.innerHTML = `
    <p><strong>Dietary Restrictions:</strong> ${dietaryRestrictions}</p>
    <p><strong>Preferred Cuisines:</strong> ${preferredCuisines}</p>
    <p><strong>Allergies:</strong> ${allergies}</p>
  `;

  // Change the button text after the first submission
  if (!preferencesSubmitted) {
    preferencesSubmitted = true;
    document.getElementById('submitButton').innerText = 'Update Preferences';

    // Clear form inputs after submission
    document.getElementById('dietary-restrictions').value = '';
    document.getElementById('preferred-cuisines').value = '';
    document.getElementById('allergies').value = '';
  }
}

async function submitRating() {
  // Get the input value
  const ratingInput = document.querySelector(".rating");
  const rating = parseFloat(ratingInput.value);

  // Check if the rating is valid
  if (isNaN(rating) || rating < 1 || rating > 5) {
    alert("Please enter a valid rating between 1 and 5.");
    return;
  }

  // Send a POST request to the server
  try {
    const response = await fetch("/submit-rating", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rating }),
    });

    if (!response.ok) {
      throw new Error("Failed to submit rating.");
    }

    const result = await response.json();
  } catch (error) {
    console.error(error.message);
    alert("Failed to submit rating. Please try again.");
  }

  // Reset the input field
  ratingInput.value = "";
}

async function fetchAverageRatings() {
  try {
    // Assume you have an endpoint that returns average ratings for featured recipes
    const response = await fetch("/get-average-ratings");
    if (!response.ok) {
      throw new Error("Failed to fetch average ratings.");
    }

    const averageRatings = await response.json();

    // Display average ratings for each featured recipe
    const averageRatingElements = document.querySelectorAll(".averageRating");
    averageRatingElements.forEach((element, index) => {
      element.textContent = `Average Rating: ${averageRatings[index]}`;
    });
  } catch (error) {
    console.error(error.message);
    // Handle error fetching average ratings
  }
}

// Call fetchAverageRatings when the page loads
window.onload = fetchAverageRatings;
