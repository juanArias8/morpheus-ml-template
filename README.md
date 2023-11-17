# Morpheus ML Template - Quickstart Guide

Welcome to Morpheus ML Template, a quick start machine learning framework specializing in image and text generation.
This guide will help you quickly set up and run the project.

## Prerequisites

Before starting, ensure you have the following prerequisites:

1. **Docker and Docker Compose**: The project is containerized for ease of deployment. Ensure you have Docker and Docker
   Compose installed on your system. Visit [Docker's official website](https://docs.docker.com/get-docker/) for
   installation instructions.

2. **GPU Availability**: This project requires a GPU for optimal performance, particularly for tasks like image
   generation with Stable Diffusion models. Verify that your system has a compatible GPU.

3. **Google Firebase Account**: This template uses Firebase for auth and analytics. Please create a Google Firebase
   account, set up a web application under Firebase, and generate a Python service account. Make sure to enable
   authentication. Visit [Firebase Console](https://console.firebase.google.com/) to get started. You can also follow
   the
   Morpheus [Firebase Integration Guide](https://github.com/Monadical-SAS/Morpheus/blob/main/docs/firebase/firebase.md)

## Configuration

1. **Environment Variables**: After setting up Firebase, replace the necessary values in the `server` and `client`
   configurations with your Firebase environment variables.

## Deployment

Follow these steps to deploy Morpheus ML:

1. **Build Docker Compose Services**:
   Navigate to the root directory of the project and build the Docker services using:
   ```
   docker-compose build
   ```

2. **Database Migrations**:
   Run the following command to apply database migrations using Alembic:
   ```
   docker-compose run server alembic upgrade head
   ```

3. **Start the Server**:
   Launch the project using:
   ```
   docker-compose up
   ```

   Upon successful launch, the following services will be accessible:

    - **Client**: Running on [localhost:3000](http://localhost:3000).
    - **Server**: Accessible at [localhost:8001](http://localhost:8001).
    - **Ray Dashboard**: Available at [localhost:8265](http://localhost:8265).

## Features

Morpheus ML Template offers the following main features:

- **Image Generation**: Utilizes Stable Diffusion models for state-of-the-art image generation.
  ![Screenshot from 2023-11-17 01-06-33](https://github.com/juanArias8/morpheus-ml-template/assets/19536830/aeba2033-4494-4189-879b-5a087228d001)

- **Text Generation**: Leverages Large Language Models (LLM) for advanced text generation capabilities.
  ![Screenshot from 2023-11-17 01-39-18](https://github.com/juanArias8/morpheus-ml-template/assets/19536830/105f2fc3-e638-45a6-97f8-007ad5bb5752)
  
- **Storytelling**: A unique feature combining both image and text generation to create compelling narratives.
  ![Screenshot from 2023-11-17 02-15-17](https://github.com/juanArias8/morpheus-ml-template/assets/19536830/c85d3df1-f2d9-4618-94c6-ab89c0fae8e0)

- **Authentication**: Supports email-password and Google login.
  ![Screenshot from 2023-11-17 03-06-19](https://github.com/juanArias8/morpheus-ml-template/assets/19536830/9807e968-5460-4d99-a4cf-9786d13a427e)
  
- **User Profile**: A user profile page with an update form.
  ![image](https://github.com/juanArias8/morpheus-ml-template/assets/19536830/234989f7-4349-4ecd-ab14-9373dea84293)

- **Newsletters**: Form for users to subscribe to newsletters.
  ![Screenshot from 2023-11-17 03-09-22](https://github.com/juanArias8/morpheus-ml-template/assets/19536830/5bb80986-2aac-479a-b229-42ed1171211f)

- **Analytics**: Google analytics integration


For detailed documentation, feature descriptions, and advanced configurations, please refer to
the [Morpheus Wiki](https://github.com/Monadical-SAS/Morpheus/wiki).

---

We hope you enjoy working with Morpheus ML Template. For any issues or contributions, please refer to our GitHub
repository or contact the development team.
