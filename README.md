# Trikon-WeForShe 🎀
# Design Diva - Discover fashion that matches your creativity! 💃
### An Integration for customization that enhances user engagements on the Myntra Platform

![image](https://github.com/user-attachments/assets/163e1af5-94cc-40b3-a559-7ac7d48693e8)



## Introduction
**Design Diva** ✨ is an innovative platform designed to enhance user engagement on the Myntra platform by offering personalized product recommendations and customization options. Users can upload sketches or create designs, and our recommendation system will suggest similar products available on Myntra. 

**Myra** 🤖 is a Myntra Order Assistant through which the user can place a customized product order if Myntra's Recommendations do not match their expectations!

## Tech Stack

### Backend 👨‍💻
- **Python:** Core programming language for model development.
- **Flask:** Web framework for creating the web server, handling requests, and rendering templates.
- **TensorFlow & Keras:** Used for loading the ResNet-50 model and feature extraction.
- **Pillow (Python Imaging Library):** For saving and manipulating image files.
- **NumPy:** For handling image data and feature vectors.
- **Scikit-learn:** For implementing the K-Nearest Neighbors (KNN) algorithm.
- **Pickle:** For saving and loading image embeddings and filenames.

### Frontend 📲
- **HTML, CSS, and Vanilla JavaScript:** Used to create a basic and interactive website interface.

### Additional Libraries and Tools ⚒️
  - base64
  - os
  - io (BytesIO)

## Setup Instructions 💻

### Prerequisites

- Python 3.x
- pip (Python package installer)
- A virtual environment (recommended)

### Installation

1. **Clone the repository:** 🔀

    ```bash
    git clone https://github.com/yourusername/image-recommendation-system.git
    cd image-recommendation-system
    ```

2. **Create and activate a virtual environment:**

    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

3. **Install the required packages:** ⬇️

    ```bash
    pip install -r requirements.txt
    ```
5. **Running the Notebook**
     Make sure you have a GPU setup on your device to run the notebook, else you can use online services such as Kaggle and google colab to generate the pickle files.
   
6. **Download the trained ResNet50 embeddings and filenames:**
   
    Generate and save `embeddings.pkl` and `filenames.pkl` by running the Notebook provided in the repository. The filenames.pkl and embeddings.pkl required for running        the repository is already provided. The embeddings.pkl file is zipped using `gzip`, so make sure to unzip it before using

5. **Prepare the dataset:** 📝

   Place your dataset images in the `images` directory. It is already provided in the repository, The dataset is [MyntraDataset](https://www.kaggle.com/datasets/paramaggarwal/fashion-product-images-dataset). Lower-resolution images are used because of their large size.


6. **Run the Flask application:**

    ```bash
    python app.py
    ```

7. **Open your browser and navigate to:**

    ```
    http://127.0.0.1:5000
    ```
## 🚩 Compatibility Issues
  If you encounter compatibility issues, ensure that TensorFlow version 2.13 is installed in your virtual environment. Alternatively, you can run the notebook on your        device where the Flask app is being used.


## Project Workflow

1. **Dataset and Model:** 📝
   - We used a dataset containing 44,000 fashion images.
   - A pre-trained CNN model, ResNet-50, captures complex and abstract features of each image.

2. **Feature Extraction:** 💡
   - A function called `feature_extraction` processes each image through ResNet-50 to generate a numerical vector (embedding) representing its features.
   - When a new image is uploaded, its embedding is compared with those in the dataset using KNN with Euclidean similarity.

3. **Recommendation:** 🔎
   - Images in the dataset are ranked based on their similarity scores to the new image's embedding.
   - The top 10 similar images are displayed as recommendations.

    
## Usage

1. **Upload or Draw a Sketch:** 🎨
   - Users can upload a sketch or create one using the provided canvas interface, which includes features for coloring and using shapes.

2. **View Recommendations:** 🔎
   - The image is processed, and similar products are recommended along with their prices.

3. **Purchase or Customize:** 🛒
   - If the recommended product matches the user's customization, they can buy it from Myntra.
   - Otherwise, users can interact with Myra, Myntra’s order assistant, to explore further customization options and place their order.



Warm regards,  
**Team Trikon**  
*IIT BHU Varanasi*

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
