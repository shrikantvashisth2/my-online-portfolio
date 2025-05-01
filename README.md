# My Interactive Portfolio Game

**(Replace this line with a cool screenshot or GIF of your portfolio in action!)**
[![Portfolio Preview](PLACEHOLDER_FOR_YOUR_SCREENSHOT_URL)](YOUR_LIVE_DEPLOYMENT_URL_IF_ANY)

---

## Welcome!

Hello there! This isn't just your average portfolio website. It's an **interactive experience** where visitors can "run" a character (currently a pixelated dinosaur) through different sections showcasing your skills, projects, experience, and more.

Think of it like a side-scrolling game, but the levels are *your* professional journey! As you run right, you progress through the different parts of your resume, with animations and effects along the way.

This project was built with React and aims to be a more engaging way to present your profile than a static page.

## Features

*   **Gamified Navigation:** Run left and right, jump, and explore sections.
*   **Interactive Sections:** Content like skills and experience points appear dynamically as you run into their zones.
*   **Dynamic Content Loading:** Shows different overlays and information based on the current section (Intro, About, Projects, etc.).
*   **Engaging Visuals:**
    *   Smooth character animations (using a GIF).
    *   Day/Night cycle effect in the background.
    *   Particle effects for movement and item reveals.
    *   Animated project image slideshow.
    *   Section transition warnings.
*   **Customizable:** Easily update with *your* information, images, and resume.
*   **Modern Tech:** Built with React, Framer Motion for animations, Tailwind CSS for styling, and Lucide Icons.

## About This Project

Why build a portfolio that plays like a game?

Traditional portfolios can sometimes feel a bit static. While effective, they might not always capture the personality or the *process* behind the skills listed. This project started with the idea of making the exploration of a professional profile more **dynamic, memorable, and perhaps more engaging.**

The goal was to blend web development expertise (React, modern frontend practices) with concepts often found in game development (character control, scrolling environments, visual feedback). It's an experiment in creating a unique user experience that stands out.

By making the user actively *move* through the content, the hope is to create a stronger connection and make the information more engaging than simply scrolling down a page. It also serves as a practical demonstration of skills in:

*   State management in React (`useState`, `useEffect`, `useRef`).
*   Implementing smooth animations and transitions (Framer Motion).
*   Structuring a component-based application.
*   Responsive design considerations (using Tailwind CSS).
*   Handling user input and basic physics simulation.

Ultimately, it's a personal project designed to showcase both technical ability and a bit of creative flair.

## Tech Stack

*   **React:** Frontend library for building the UI.
*   **Framer Motion:** For smooth animations and transitions.
*   **Tailwind CSS:** Utility-first CSS framework for styling.
*   **Lucide React:** Clean and consistent icons.
*   **Vite (or Create React App):** Project setup and development server (Assuming you used one of these).
*   **JavaScript (with JSX):** The core language.
*   **(Optional) uuid:** For generating unique keys for dynamic elements like particles.

## Getting Started

Ready to run this project locally and make it your own? Follow these steps:

### Prerequisites

Make sure you have the following installed on your system:

*   **Node.js:** (Version 16.x or higher recommended) - This includes `npm` (Node Package Manager). You can download it from [nodejs.org](https://nodejs.org/).
*   **Git:** For cloning the repository.

### Installation & Running

1.  **Clone the Repository:**
    Open your terminal or command prompt and run:
    ```bash
    git clone <your-repository-url>
    cd <repository-folder-name>
    ```
    *(Replace `<your-repository-url>` and `<repository-folder-name>` with the actual URL and folder name)*

2.  **Install Dependencies:**
    Install all the necessary libraries listed in `package.json`:
    ```bash
    npm install
    ```
    *(If you prefer using Yarn, run `yarn install`)*

3.  **Run the Development Server:**
    Start the local development server:
    ```bash
    npm run dev
    ```
    *(Or `yarn dev` if you use Yarn. If your project was set up with Create React App, the command might be `npm start` or `yarn start`)*

4.  **Open in Browser:**
    The terminal will likely show you a local URL (usually `http://localhost:5173` or `http://localhost:3000`). Open this URL in your web browser.

You should now see the interactive portfolio running locally.

## Customization Guide

This is where you make the portfolio truly **yours**. Most of the content changes happen within the main component file (likely `src/PortfolioCarGame.js` or similar).

### 1. Update Portfolio Content (`sections` object)

*   Open the main component file (e.g., `src/PortfolioCarGame.js`).
*   Find the `sections` JavaScript object near the top. This holds *all* the text content for each section.
*   **Edit Text:** Go through each section (`intro`, `about`, `skills`, `experience`, `projects`, `awards`, `certifications`, `education`, `resume`, `contact`) and replace the placeholder text, titles, descriptions, labels, etc., with your own details.
*   **List Items:** For sections like `skills`, `experience`, `projects`, etc. (those with `type: 'list'`), modify the `items` array. Add, remove, or edit the objects within the array. Each object usually has an `id`, `label`, `description`, and sometimes an `icon` or `imageUrl`.
*   **Contact Details:** Update the `details` array within the `contact` section with your correct email, LinkedIn, GitHub, and phone number (if desired). Remember to update the `href` (the actual link) as well as the `label`.
*   **Resume Link:** Update the `resumeUrl` and `linkText` in the `resume` section.

### 2. Add Your Profile Picture

*   Find a good profile picture of yourself (a square aspect ratio works well).
*   Place the image file (e.g., `profile.jpg`, `profile.png`) inside the `public/` folder in your project's root directory.
*   In the `sections` object, find the `'about'` section.
*   Update the `profilePictureUrl` property to point to your image file:
    ```javascript
    'about': {
        // ... other properties
        profilePictureUrl: '/profile.jpg', // <-- Change this to '/your-image-name.ext'
        // ... content
    },
    ```
    *(The path starts with `/` because it's relative to the `public` folder).*

### 3. Add Project Images

*   Gather images or screenshots for your projects (landscape orientation often looks good in the slideshow).
*   Place these image files inside the `public/` folder.
*   In the `sections` object, find the `'projects'` section.
*   For each project item in the `items` array, update the `imageUrl` property:
    ```javascript
      { id: 'p1', label: 'SanskritAI', /*...*/ imageUrl: '/sanskritai.jpeg' }, // <-- Change '/sanskritai.jpeg'
      { id: 'p2', label: 'DivineWall', /*...*/ imageUrl: '/divinewall.jpeg' }, // <-- Change '/divinewall.jpeg'
      // etc.
    ```

### 4. Add Your Resume File

*   Get your resume ready in PDF format (recommended).
*   Place the resume file (e.g., `MyResume.pdf`) inside the `public/` folder.
*   In the `sections` object, find the `'resume'` section.
*   Update the `resumeUrl` property:
    ```javascript
    'resume': {
        // ... other properties
        resumeUrl: '/MyResume.pdf', // <-- Change this to '/your-resume-filename.pdf'
        linkText: 'Download My Resume', // You can change the button text too
    },
    ```
*   **Optional:** In the main JSX rendering part of the component (towards the bottom), find the "Resume Download Section Display". You can change the `download="Your_Name_Resume.pdf"` attribute on the `<a>` tag to suggest a filename when the user downloads it.

### 5. Change the Player Sprite (Optional)

*   Want a different character? Find a running animation GIF (ideally with a transparent background).
*   Place the GIF file (e.g., `my-sprite.gif`) inside the `public/` folder.
*   In the main component's JSX (the `return (...)` part), find the `<!-- Player Sprite -->` section.
*   Change the `src` attribute of the `<img>` tag:
    ```jsx
    <img
        src="/my-sprite.gif" // <-- Change this path
        alt="Player Character" // Update alt text too
        // ... other attributes
    />
    ```
*   **Important:** If your new sprite has significantly different dimensions than the current one, you might need to adjust the `SPRITE_VISUAL_HEIGHT` and `SPRITE_WIDTH` constants defined near the top of the component file for correct positioning and appearance.

### 6. Adjust Styling (Optional)

*   If you're comfortable with Tailwind CSS, you can modify the class names throughout the JSX in the component file to change colors, spacing, sizes, etc.

## Project Structure (Simplified)
