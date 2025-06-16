# The Horn-ya Studio

A community platform for technology enthusiasts and anime lovers to showcase their work, share ideas, and connect with like-minded individuals.

![The Horn-ya Studio](https://via.placeholder.com/1200x630?text=The+Horn-ya+Studio)

## Tech Stack

This project is built using the following technologies:

- **Frontend Framework**: React 18 with TypeScript
- **Routing**: React Router v6
- **State Management**: Context API with useReducer
- **Styling**: CSS-in-JS with inline styles (custom theming system)
- **Build Tool**: Create React App
- **Package Management**: npm/yarn

## Features

- **Dark Mode UI**: Modern, anime-inspired dark theme
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Member Profiles**: View community members and their skills
- **Member Details**: Detailed member pages with social links
- **Photo Gallery**: Community image sharing
- **Admin Panel**: Protected route for content management
  - Member management (add, edit, delete)
  - Gallery management (upload, delete)

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or later)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/horn-yastudio.git
cd horn-yastudio
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm start
# or
yarn start
```

4. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
/src
  /components         # Reusable UI components
  /context            # Application context providers
  /pages              # Page components
  /styles             # Global styles
  /theme              # Theme definition
  /types              # TypeScript type definitions
  App.tsx             # Main app component with routes
  index.tsx           # Entry point
```

## Admin Access

To access the admin panel:

1. Navigate to `/login` or click the admin route
2. Use the following credentials:
   - Username: `admin`
   - Password: `hornya123`

## Customization

### Theme

The application uses a custom dark theme defined in `/src/theme/darkTheme.ts`. You can modify colors, spacing, typography, and other design tokens in this file.

### Adding Members

Add new community members through the admin panel with the following information:
- Name
- Role
- Bio
- Skills (comma-separated)
- Profile image
- Social media links

### Adding Gallery Images

Upload images to the gallery through the admin panel with:
- Title
- Description
- Photographer name
- Image file

## Deployment

This application can be deployed to any static hosting service:

```bash
npm run build
# or
yarn build
```

This will create a `build` directory with optimized production files that can be deployed to services like:
- GitHub Pages
- Netlify
- Vercel
- Firebase Hosting

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Logo and design inspired by anime and tech aesthetics
- Community features designed for tech enthusiasts who are also anime fans
