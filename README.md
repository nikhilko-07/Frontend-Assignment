# Frontend Test Assignment

This project contains solutions for two practical tasks:

- **Question 1:** Tree View Component  
- **Question 2:** Kanban Board Component  

Both projects are built using **React + TypeScript** with a clean and minimal UI. The project demonstrates key frontend skills like state management, drag-and-drop, lazy loading, and responsive design.

---

## Prerequisites

Make sure you have **Node.js (v16+)** and **npm** installed.

---

## Installation

1. Clone the repository or extract the zip.
2. Open terminal in the project folder.
3. Install dependencies:

```bash
npm install
Run Project

To start the development server:

npm run dev

The app will start on http://localhost:5173 (or the port shown in terminal).

The screen is split into two sections:

Left side: Question 1 – Tree View Component

Right side: Question 2 – Kanban Board Component

Project Structure
/src
  /components
    /TreeView          # Tree View Component
    /KanbanBoard       # Kanban Board Component
  /mock-data           # Sample data for both components
  App.tsx              # Main layout with split screen
  main.tsx             # React entry point
Question 1 — Tree View Component

Objective: Build a fully functional Tree View component similar to the reference image.

Features:

Expand / Collapse Nodes

Parent nodes toggle between expanded and collapsed states

Expand icon changes based on state

Add New Node

Add child nodes to any parent

Input prompt or inline field to enter node name

Remove Node

Delete any node (including subtree)

Confirmation before delete

Drag & Drop Support

Reorder nodes within the same level

Move nodes across parent nodes while maintaining hierarchy

Lazy Loading

Load child nodes only when parent is expanded

Simulate API call with async behavior

Edit Node Name

Inline editing on double-click or edit icon

Deliverables:

Reusable <TreeView /> component

Mock data + lazy loading simulation

Clean UI with basic styling

Question 2 — Kanban Board Component

Objective: Create a Kanban board with three default columns (Todo, In Progress, Done).

Features:

Add / Delete Cards

Add new cards to any column

Delete existing cards

Move Cards Between Columns

Drag & drop cards across lists

Preserve card order

Editable Card Title

Inline editing of card text

Responsive Layout

Works on desktop + mobile

Columns stack vertically on small screens

Technical Details:

Uses React + TypeScript

Clean state management (Context API / Zustand optional)

Drag-and-drop using HTML5 DnD or library (React DnD / DnD Kit)

Proper component structure: Board → Column → Card

Deliverables:

Reusable <KanbanBoard /> component

Initial mock data

Minimal, clean UI styling

Notes

All functionalities for both components are implemented and working.

Run npm run dev to view the split-screen layout with both components.

The project is lightweight; node_modules are not included in the zip.

Author

Nikhil Kohli
Email: nikhilkohli07@gmail.com

GitHub: https://github.com/nikhilko-07
