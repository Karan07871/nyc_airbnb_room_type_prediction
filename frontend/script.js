/* =========================================================
   GET HTML ELEMENTS
========================================================= */

const form = document.getElementById("predictionForm");

const resultBox = document.getElementById("predictionResult");
const emptyResult = document.getElementById("emptyResult");
const errorResult = document.getElementById("errorResult");

const predictionText = document.getElementById("predictionText");

const confidenceText = document.getElementById("confidenceText");
const confidenceBar = document.getElementById("confidenceBar");

const probabilitiesBox =
    document.getElementById("probabilities");

const predictButton =
    document.getElementById("predictButton");

const buttonText =
    document.getElementById("buttonText");

const loadingSpinner =
    document.getElementById("loadingSpinner");

const demoButton =
    document.getElementById("demoButton");

const resetButton =
    document.getElementById("resetButton");

const errorMessage =
    document.getElementById("errorMessage");


/* =========================================================
   API URL
========================================================= */

const API_URL =
    "http://127.0.0.1:8000/predict";


/* =========================================================
   HELPER FUNCTION
========================================================= */

function getValue(id) {

    return document
        .getElementById(id)
        .value;

}


/* =========================================================
   DEMO DATA
========================================================= */

demoButton.addEventListener("click", function () {

    document.getElementById("latitude").value = "40.723";

    document.getElementById("longitude").value = "-73.955";

    document.getElementById("price").value = "150";

    document.getElementById("minimum_nights").value = "3";

    document.getElementById("number_of_reviews").value = "25";

    document.getElementById("reviews_per_month").value = "1.5";

    document.getElementById(
        "calculated_host_listings_count"
    ).value = "2";

    document.getElementById(
        "availability_365"
    ).value = "120";

    document.getElementById(
        "neighbourhood_group"
    ).value = "Manhattan";

    document.getElementById(
        "neighbourhood"
    ).value = "Williamsburg";


    hideError();

});


/* =========================================================
   RESET BUTTON
========================================================= */

resetButton.addEventListener("click", function () {

    form.reset();

    hidePrediction();

    hideError();

});


/* =========================================================
   FORM SUBMIT
========================================================= */

form.addEventListener("submit", async function (event) {

    event.preventDefault();


    /* -----------------------------------------
       HIDE OLD RESULTS
    ----------------------------------------- */

    hideError();

    resultBox.style.display = "none";


    /* -----------------------------------------
       GET VALUES
    ----------------------------------------- */

    const latitude =
        Number(getValue("latitude"));

    const longitude =
        Number(getValue("longitude"));

    const price =
        Number(getValue("price"));

    const minimumNights =
        Number(getValue("minimum_nights"));

    const numberOfReviews =
        Number(getValue("number_of_reviews"));

    const reviewsPerMonth =
        Number(getValue("reviews_per_month"));

    const hostListings =
        Number(
            getValue(
                "calculated_host_listings_count"
            )
        );

    const availability =
        Number(
            getValue("availability_365")
        );

    const neighbourhoodGroup =
        getValue("neighbourhood_group");

    const neighbourhood =
        getValue("neighbourhood").trim();


    /* -----------------------------------------
       VALIDATION
    ----------------------------------------- */

    if (
        price < 0 ||
        minimumNights < 1 ||
        numberOfReviews < 0 ||
        reviewsPerMonth < 0 ||
        hostListings < 0 ||
        availability < 0 ||
        availability > 365
    ) {

        showError(
            "Please enter valid listing values."
        );

        return;
    }


    if (!neighbourhoodGroup) {

        showError(
            "Please select a neighbourhood group."
        );

        return;
    }


    if (!neighbourhood) {

        showError(
            "Please enter a neighbourhood."
        );

        return;
    }


    /* -----------------------------------------
       CREATE REQUEST DATA
    ----------------------------------------- */

    const inputData = {

        latitude: latitude,

        longitude: longitude,

        price: price,

        minimum_nights: minimumNights,

        number_of_reviews: numberOfReviews,

        reviews_per_month: reviewsPerMonth,

        calculated_host_listings_count:
            hostListings,

        availability_365:
            availability,

        neighbourhood_group:
            neighbourhoodGroup,

        neighbourhood:
            neighbourhood

    };


    console.log(
        "Sending prediction request:",
        inputData
    );


    /* -----------------------------------------
       SHOW LOADING
    ----------------------------------------- */

    setLoading(true);


    try {

        /* -------------------------------------
           CALL FASTAPI
        ------------------------------------- */

        const response = await fetch(
            API_URL,
            {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(inputData)

            }
        );


        /* -------------------------------------
           READ RESPONSE
        ------------------------------------- */

        const data =
            await response.json();


        console.log(
            "API response:",
            data
        );


        /* -------------------------------------
           HANDLE API ERROR
        ------------------------------------- */

        if (!response.ok) {

            let message =
                "Prediction failed.";

            if (data.detail) {

                if (Array.isArray(data.detail)) {

                    message =
                        data.detail
                            .map(
                                error =>
                                    error.msg
                            )
                            .join(", ");

                } else {

                    message =
                        data.detail;
                }
            }

            throw new Error(message);
        }


        /* -------------------------------------
           DISPLAY PREDICTION
        ------------------------------------- */

        showPrediction(
            data,
            inputData
        );


    } catch (error) {

        console.error(
            "Prediction error:",
            error
        );


        showError(
            error.message ||
            "Unable to connect to the FastAPI server."
        );


    } finally {

        setLoading(false);

    }

});


/* =========================================================
   SHOW PREDICTION
========================================================= */

function showPrediction(data, inputData) {

    emptyResult.style.display = "none";

    errorResult.style.display = "none";

    resultBox.style.display = "block";


    /* -----------------------------------------
       Prediction text
    ----------------------------------------- */

    const prediction =
        data.prediction ||
        "Unknown";

    predictionText.textContent =
        prediction;


    /* -----------------------------------------
       Probabilities
    ----------------------------------------- */

    probabilitiesBox.innerHTML = "";


    let confidence = null;


    if (data.probabilities) {

        const probabilities =
            data.probabilities;


        const sorted =
            Object.entries(probabilities)
                .sort(
                    (a, b) =>
                        Number(b[1]) -
                        Number(a[1])
                );


        /* Highest probability = confidence */

        if (sorted.length > 0) {

            confidence =
                Number(sorted[0][1]);

        }


        sorted.forEach(
            ([roomType, probability]) => {

                const value =
                    Number(probability);


                const row =
                    document.createElement("div");

                row.className =
                    "probability-row";


                row.innerHTML = `

                    <span class="probability-name">
                        ${escapeHTML(roomType)}
                    </span>

                    <div class="probability-track">

                        <div
                            class="probability-fill"
                            style="width: ${value}%"
                        ></div>

                    </div>

                    <span class="probability-value">
                        ${value.toFixed(1)}%
                    </span>

                `;


                probabilitiesBox.appendChild(row);

            }
        );

    }


    /* -----------------------------------------
       Confidence
    ----------------------------------------- */

    if (confidence !== null) {

        confidenceText.textContent =
            confidence.toFixed(1) + "%";

        setTimeout(function () {

            confidenceBar.style.width =
                confidence + "%";

        }, 100);

    } else {

        confidenceText.textContent =
            "Available after model update";

        confidenceBar.style.width =
            "0%";
    }


    /* -----------------------------------------
       Summary
    ----------------------------------------- */

    document.getElementById(
        "summaryLocation"
    ).textContent =
        inputData.neighbourhood +
        ", " +
        inputData.neighbourhood_group;


    document.getElementById(
        "summaryPrice"
    ).textContent =
        "$" +
        inputData.price;


    document.getElementById(
        "summaryReviews"
    ).textContent =
        inputData.number_of_reviews;


    document.getElementById(
        "summaryAvailability"
    ).textContent =
        inputData.availability_365 +
        " days";


    /* -----------------------------------------
       Scroll result into view on mobile
    ----------------------------------------- */

    if (window.innerWidth < 900) {

        resultBox.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

}


/* =========================================================
   SHOW ERROR
========================================================= */

function showError(message) {

    resultBox.style.display = "none";

    emptyResult.style.display = "none";

    errorResult.style.display = "flex";

    errorMessage.textContent =
        message;

}


/* =========================================================
   HIDE ERROR
========================================================= */

function hideError() {

    errorResult.style.display =
        "none";

}


/* =========================================================
   HIDE PREDICTION
========================================================= */

function hidePrediction() {

    resultBox.style.display =
        "none";

    emptyResult.style.display =
        "flex";

    confidenceBar.style.width =
        "0%";

    probabilitiesBox.innerHTML =
        "";

}


/* =========================================================
   LOADING STATE
========================================================= */

function setLoading(isLoading) {

    predictButton.disabled =
        isLoading;


    if (isLoading) {

        buttonText.textContent =
            "Analyzing listing...";

        loadingSpinner.style.display =
            "inline-block";

    } else {

        buttonText.textContent =
            "Predict Room Type";

        loadingSpinner.style.display =
            "none";

    }

}


/* =========================================================
   BASIC HTML ESCAPING
========================================================= */

function escapeHTML(value) {

    return String(value)

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");
}