# ExNihilo

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Version](https://img.shields.io/badge/version-0.1.0-lightgrey)

ExNihilo is a fitness tracking application designed to help users create and manage workout routines, log exercises, and track progress over time. Inspired by the concept of "creation from nothing," this app empowers users to build a healthier lifestyle through personalized fitness management.

---

## 🚀 Features
- **Routine Management**: Create, edit, and organize routines by days of the week.
- **Exercise Logging**: Track exercises, sets, reps, and weights for each session.
- **Progress Tracking**: Monitor your fitness journey with insightful stats and analytics.
- **Social Features** (Planned): Share routines, upvote community movements, and earn achievements.
- **Coach’s Portal** (Planned): Tools for trainers to track and manage client progress.

---

## 🛠️ Tech Stack
- **Frontend**: Angular
- **Backend**: Node.js with Express
- **Database**: PostgreSQL
- **Hosting**: GitHub Pages (Frontend), [TBD Backend Host]

---

## 📁 Project Structure
```plaintext
ExNihilo/
├── backend/                # Node.js backend
├── frontend/               # Angular frontend
├── docs/                   # Documentation and planning
├── .gitignore              # Git ignore rules
├── README.md               # Project documentation
└── LICENSE                 # Project license
```

---

## 🔧 Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v20+)
- [Angular CLI](https://angular.io/cli) (v12+)
- PostgreSQL (v12+)

### Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/trentbullard/exnihilo.git
   cd exnihilo
   ```

2. Install dependencies for the backend:
   ```bash
   cd backend
   npm install
   ```

3. Install dependencies for the frontend:
   ```bash
   cd ../frontend
   npm install
   ```

4. Set up environment variables:
   - Create a `.env` file in the `backend/` directory with the following variables:
     ```env
     DATABASE_URL=postgres://<user>:<password>@<host>:<port>/<database>
     JWT_SECRET=<your-secret-key>
     ```

5. Start the development servers:
   - Backend:
     ```bash
     cd backend
     npm run start:dev
     ```
   - Frontend:
     ```bash
     cd ../frontend
     ng serve
     ```

---

## 🖥️ Deployment
### Frontend
1. Build the Angular app for GitHub Pages:
   ```bash
   ng build --output-path docs --base-href /ExNihilo/
   ```
2. Push the `docs/` folder to the `gh-pages` branch:
   ```bash
   npx gh-pages -d docs
   ```

### Backend
1. Deploy the Node.js server to a platform like Heroku or Render.

---

## 📚 Documentation
- [Planning Documents](./docs/planning/)
- [API Reference](./docs/api-reference.md) (Coming Soon)
- [User Guide](./docs/user-guide.md) (Coming Soon)

---

## 🎯 Roadmap
- [x] Initialize project structure.
- [ ] Implement routine and workout management.
- [ ] Add completed workout tracking.
- [ ] Integrate analytics and progress tracking.
- [ ] Develop social and gamification features.
- [ ] Launch Coach’s Portal for client management.

---

## 🤝 Contributing
Contributions are welcome! Please see our [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## 📄 License
This project is licensed under the [MIT License](./LICENSE).

---

## 📞 Contact
For questions or feedback, reach out to:
- [GitHub Issues](https://github.com/trentbullard/exnihilo/issues)
- Email: [trent.bullard@gmail.com](mailto:trent.bullard@gmail.com)

---

## 🙌 Acknowledgements
Inspired by biblical themes and powered by modern tech. Special thanks to the open-source community for making this project possible!
