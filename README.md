<div align="center">

<img src="public/kmate-logo.svg" alt="KMate Logo" width="140"/>

# KMate

### Your companion for everything KIIT.

A student-built platform that brings together essential KIIT resources in one place. From **Section Swapping** and **Class Timetables** to **Section Group Links**, KMate is designed to make student life easier.

<p>
    <a href="https://section-swapping-zdyj.vercel.app/">
        <img src="https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge&logo=vercel">
    </a>
    <a href="https://github.com/sarojsenn/section-swapping">
        <img src="https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github">
    </a>
</p>

<p>
<img src="https://img.shields.io/badge/React-Frontend-61DAFB?logo=react">
<img src="https://img.shields.io/badge/TailwindCSS-Styling-06B6D4?logo=tailwindcss">
<img src="https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase">
<img src="https://img.shields.io/badge/Vite-Build-646CFF?logo=vite">
<img src="https://img.shields.io/badge/License-MIT-success">
</p>

</div>

---

# 📖 About

Every semester, KIIT students switch between multiple WhatsApp groups, PDFs, and websites to access important academic resources.

KMate brings these resources together in one place.

The platform initially started as **KSwapFinder**, a website to simplify section swapping. As more students began using it, the vision expanded into building a centralized platform for everyday student needs.

Currently, KMate provides:

- 🔄 Section Swapping
- 📅 Class Timetables
- 👥 Unofficial Section Groups

More features like **Previous Year Questions (PYQs)**, **Notes**, and other academic tools are planned for future releases.

---

# ✨ Features

## 🔄 Section Swapping

- Post section swap requests
- Browse all active requests
- Instant **Perfect Match** detection
- **Partial Match** suggestions
- No login required

---

## 📅 Class Timetables

- View section-wise timetables
- Quick access
- Mobile-friendly interface

---

## 👥 Section Groups

- Browse unofficial section WhatsApp groups
- Add missing group links
- Help other students discover their class groups

---

## 🚀 General

- No registration required
- Completely free
- Responsive UI
- Fast and lightweight
- Built specifically for KIIT students

---

# 💻 Tech Stack

| Category | Technology |
|-----------|------------|
| Frontend | React.js |
| Styling | Tailwind CSS |
| State Management | React Context API |
| Backend | Supabase |
| Database | PostgreSQL |
| Build Tool | Vite |
| Deployment | Vercel |

---

# 📂 Project Structure

```text
KMate
│
├── public/
│   ├── kiit-images/
│   ├── favicon.svg
│   ├── icons.svg
│   └── kmate-logo.svg
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── lib/
│   ├── utils/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .gitignore
├── .oxlintrc.json
├── index.html
├── package.json
├── package-lock.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

# 🏗️ Architecture

```text
                React Frontend
                      │
                      ▼
            Reusable Components
                      │
                      ▼
             React Context API
                      │
                      ▼
             Supabase Client
                      │
                      ▼
        Supabase PostgreSQL Database
```

---

# 🚀 Getting Started

Clone the repository

```bash
git clone https://github.com/sarojsenn/section-swapping.git
```

Move into the project

```bash
cd section-swapping
```

Install dependencies

```bash
npm install
```

Create a `.env` file

```env
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

Run the development server

```bash
npm run dev
```

---

# 📸 Screenshots

## Home

<p align="center">
    <img src="screenshots/home.png" width="900">
</p>

## Section Swap

<p align="center">
    <img src="screenshots/section-swap.png" width="900">
</p>

## Timetable

<p align="center">
    <img src="screenshots/timetable.png" width="900">
</p>

## Section Groups

<p align="center">
    <img src="screenshots/groups.png" width="900">
</p>

---

# 🗺️ Roadmap

- ✅ Section Swapping
- ✅ Class Timetables
- ✅ Section Group Links
- 🚧 Previous Year Questions (PYQs)
- 🚧 Notes Repository
- 🚧 Attendance Calculator
- 🚧 CGPA Calculator
- 🚧 Academic Calendar
- 🚧 Faculty Directory
- 🚧 Campus Notices

---

# 🤝 Contributing

Contributions are welcome.

```bash
# Fork the repository

# Create a new branch
git checkout -b feature-name

# Commit your changes
git commit -m "Add new feature"

# Push
git push origin feature-name
```

Then open a Pull Request.

---

# ⚠️ Disclaimer

KMate is an **unofficial** platform built by students for students.

For the **Section Swap** feature, KMate only helps students find **mutual section swaps**.

The platform **does not encourage, promote, or support** exchanging money or any other form of payment for section swaps.

KMate is **not affiliated with KIIT University**.

---

# 👨‍💻 Author

**Saroj Sen**

**GitHub:** https://github.com/sarojsenn

**LinkedIn:** https://www.linkedin.com/in/saroj-sen-227549318/

**Live Website:** https://section-swapping-zdyj.vercel.app/

---

# ⭐ Support

If you found KMate useful, consider giving this repository a **Star**.

Your support helps the project reach more KIIT students and motivates future development.

---

<div align="center">

### Built by a KIIT student, for the KIIT community.

</div>