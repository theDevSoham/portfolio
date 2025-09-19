# Portfolio Website

A modern, responsive portfolio website built with **Next.js 14 (App Router)**, **TypeScript**, **Framer Motion**, and **Cloudinary** for showcasing projects. Designed for developers to present projects, blogs, and personal skills in a visually engaging way.

---

## Table of Contents

* [Features](#features)
* [Tech Stack](#tech-stack)
* [Project Structure](#project-structure)
* [Demo & Screenshots](#demo--screenshots)
* [Getting Started](#getting-started)
* [API Routes](#api-routes)
* [Deployment](#deployment)
* [Environment Variables](#environment-variables)
* [Contributing](#contributing)
* [License](#license)

---

## Features

* **Dynamic Project Pages**: Each project has its own page with carousel images, tags, descriptions, and meta info.
* **Image Uploads**: Seamless image uploads to Cloudinary with serverless API routes.
* **Responsive Design**: Works perfectly on desktop, tablet, and mobile.
* **Animations**: Smooth UI animations using Framer Motion.
* **Authentication & Admin Panel**: Secure admin login to manage projects (via NextAuth).
* **SEO Friendly**: Metadata per project and proper semantic HTML.
* **Tags & Filtering**: Projects are tagged and easily filterable.

---

## Tech Stack

* **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS, Framer Motion
* **Backend/API**: Next.js API Routes, Prisma ORM
* **Database**: MongoDB (via Prisma)
* **File Storage**: Cloudinary
* **Authentication**: NextAuth.js
* **Deployment**: Vercel

---

## Project Structure

```
/src
 ├─ /app
 │   ├─ /projects
 │   │   ├─ [slug]/page.tsx          # Individual project page
 │   │   └─ page.tsx                  # Projects listing page
 │   └─ /api
 │       ├─ /projects/[slug]/route.ts # Project fetch API
 │       └─ /upload/route.ts          # Image upload API
 ├─ /lib
 │   ├─ prisma.ts                      # Prisma client
 │   └─ cloudinary.ts                  # Cloudinary client
 └─ /components
     └─ Reusable UI components
```

---

## Demo & Screenshots

### Home / Projects Listing

![Home Page](https://via.placeholder.com/800x400.png?text=Home+Page+Screenshot)

---

### Individual Project Page

![Project Page](https://via.placeholder.com/800x400.png?text=Project+Page+Screenshot)

* Image carousel with previous/next buttons
* Animated transitions using Framer Motion
* Tags and project metadata

---

### Admin Panel

![Admin Panel](https://via.placeholder.com/800x400.png?text=Admin+Panel+Screenshot)

* Secure login using email/password
* Upload project images
* Add/edit project details, tags, and links

---

### Image Upload Example

![Upload Demo](https://via.placeholder.com/800x400.png?text=Image+Upload+Demo)

* Upload directly to Cloudinary
* Serverless API handles file storage
* Live preview after upload

---

## Getting Started

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/portfolio.git
cd portfolio
```

2. **Install dependencies**

```bash
yarn install
```

3. **Set environment variables**

Create a `.env.local` file:

```env
DATABASE_URL=<your-mongodb-url>
NEXTAUTH_SECRET=<your-nextauth-secret>
NEXTAUTH_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>
ADMIN_USER=<admin-email>
ADMIN_PASSWORD=<admin-password>
```

4. **Run the development server**

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view your portfolio.

---

## API Routes

| Route                  | Method | Description                         |
| ---------------------- | ------ | ----------------------------------- |
| `/api/projects`        | GET    | Fetch all projects                  |
| `/api/projects/[slug]` | GET    | Fetch project by slug               |
| `/api/upload`          | POST   | Upload project images to Cloudinary |

---

## Deployment

* **Vercel** recommended for seamless Next.js App Router deployment.
* Ensure **environment variables** are set in Vercel dashboard for production:

```env
NEXTAUTH_URL=https://your-domain.vercel.app
DATABASE_URL=<production-mongodb-url>
NEXTAUTH_SECRET=<secret>
CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<api-key>
CLOUDINARY_API_SECRET=<api-secret>
```

---

## Environment Variables

* `DATABASE_URL`: MongoDB connection string
* `NEXTAUTH_SECRET`: Secret for NextAuth sessions
* `NEXTAUTH_URL`: App URL for auth redirects
* `CLOUDINARY_CLOUD_NAME`: Cloudinary account cloud name
* `CLOUDINARY_API_KEY`: Cloudinary API key
* `CLOUDINARY_API_SECRET`: Cloudinary API secret
* `ADMIN_USER`: Admin login email
* `ADMIN_PASSWORD`: Admin password

---

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/new-feature`)
3. Make your changes
4. Commit and push (`git commit -m "Add new feature" && git push`)
5. Open a pull request

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---
