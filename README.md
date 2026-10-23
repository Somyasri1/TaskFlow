# TaskFlow — Task Management Dashboard

TaskFlow is a responsive task management dashboard designed to help users organize tasks, track progress, and manage daily activities through a clean and interactive interface.

Built with HTML, CSS, and JavaScript, the application provides task management features, filtering options, progress statistics, and persistent browser storage.

## Features

- **Task Management:** Create, edit, and delete tasks.
- **Task Details:** Add descriptions, categories, priorities, and due dates.
- **Task Completion:** Mark tasks as completed and track active work.
- **Search and Filtering:** Search tasks and filter them by category or status.
- **Task Views:** View all tasks, today's tasks, upcoming tasks, and completed tasks.
- **Sorting:** Organize tasks by due date, priority, or recently created tasks.
- **Dashboard Statistics:** View total, active, completed, and overdue task counts.
- **Data Persistence:** Save tasks in browser local storage so they remain available after refreshing the page.
- **Delete Confirmation:** Confirm before permanently deleting a task.
- **Responsive Interface:** Adapt the dashboard layout to different screen sizes.
- **Modern UI:** Dark navy background with purple accents and styled task cards.

## Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Page structure and application elements |
| CSS3 | Styling, layout, responsive design, and visual effects |
| JavaScript | Task operations, filtering, sorting, and dashboard interactions |
| Browser Local Storage | Persistent storage of task data |

## Getting Started

### Prerequisites

- A modern web browser
- Git (optional, for cloning the repository)
- Visual Studio Code (recommended for development)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Somyasri1/TaskFlow.git
   ```

2. Navigate to the project directory:

   ```bash
   cd TaskFlow
   ```

3. Open the project in Visual Studio Code:

   ```bash
   code .
   ```

4. Open `index.html` in your browser. You can also use the **Live Server** extension in VS Code for local development.

No backend server or database setup is required for the browser-based version.

## Project Structure

```text
TaskFlow/
├── index.html    # Application structure
├── style.css     # Styling and responsive layout
├── script.js     # Task management functionality
└── README.md     # Project documentation
```

## How to Use

1. Open the TaskFlow application in your browser.
2. Create a task and enter its title, description, category, priority, and due date.
3. Edit task details whenever necessary.
4. Mark tasks as completed when finished.
5. Use the search bar, filters, and sorting options to organize your tasks.
6. Monitor your progress using the dashboard statistics.
7. Delete tasks when they are no longer needed.

## Data Storage

TaskFlow uses the browser's `localStorage` to save task data between page refreshes. Data is stored locally in the browser and is not automatically synchronized across different browsers or devices.

Clearing the browser's site data may remove saved tasks. Exporting, cloud synchronization, and account-based storage are not included unless implemented separately.

## Future Improvements

Potential enhancements include:

- User authentication and individual task lists
- Cloud database integration
- Task reminders and notifications
- Drag-and-drop task organization
- Task export and import
- Dark and light theme selection

## Author

**Somya Sri Uppalapati**

GitHub: [Somyasri1](https://github.com/Somyasri1)

Project Repository: [TaskFlow](https://github.com/Somyasri1/TaskFlow)

---

*TaskFlow is a front-end project built to practice web development, interactive user interfaces, and task management functionality.*
