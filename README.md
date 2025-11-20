# TOR Relay Tracer Dashboard

A secure, investigator-focused web application UI for tracing and visualizing probable source paths of TOR traffic.

## Features

- **Investigative Dashboard**: Track active cases and recent traces.
- **Relay Visualization**: Interactive force-directed graph showing Entry -> Middle -> Exit nodes.
- **Event Timeline**: Visual timeline of packet flows and events.
- **Confidence Scoring**: Detailed analysis of relay paths with confidence scores.
- **Secure Access**: Mock login system with role-based access control simulation.

## Tech Stack

- **Frontend**: React (Vite) + TypeScript
- **Styling**: Tailwind CSS (v3)
- **Visualization**: react-force-graph, D3.js
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```

3.  **Build for Production**:
    ```bash
    npm run build
    ```

## Project Structure

- `src/components`: Reusable UI components (Sidebar, Drawer, Visualizations).
- `src/layouts`: Page layouts.
- `src/pages`: Application pages (Login, Dashboard).
- `src/hooks`: Custom React hooks.

## License

Private / Restricted Use.
