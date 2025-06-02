# @uxland/cerberus-calendar

A modern, feature-rich React calendar component library with TypeScript support.

## 🚀 Quick Start

### Installation

```bash
npm install @uxland/cerberus-calendar
```

### Basic Usage

```typescript
import '@uxland/cerberus-calendar/dist/style.css'
import { Calendar, cerberusTheme } from '@uxland/cerberus-calendar'
import type { CalendarEvent } from '@uxland/cerberus-calendar'

const events: CalendarEvent[] = [
  {
    id: '1',
    title: 'Team Meeting',
    start: new Date(2025, 4, 29, 10, 0),
    end: new Date(2025, 4, 29, 11, 0),
    color: '#3B82F6'
  }
]

function App() {
  return (
    <Calendar
      events={events}
      theme={cerberusTheme}
      initialView="week"
      config={{
        timeSlotDuration: 30,
        businessHours: { start: '09:00', end: '18:00' },
        weekStartsOn: 1
      }}
      onEventCreate={(event) => console.log('Created:', event)}
      onEventUpdate={(eventId, updates) => console.log('Updated:', eventId, updates)}
      onEventDelete={(eventId) => console.log('Deleted:', eventId)}
    />
  )
}
```

## 📚 Documentation

- **[Complete Library Documentation](./README-LIB.md)** - Full API reference and configuration options
- **[Usage Examples](./EXAMPLE-USAGE.md)** - Real-world implementation examples  
- **[Completion Summary](./LIBRARY-COMPLETION-SUMMARY.md)** - Build process and verification details

## 🎯 Features

- ✅ **Multiple Views**: Day, Week, Month views
- ✅ **Event Management**: Create, edit, delete events
- ✅ **TypeScript**: Full type safety and IntelliSense
- ✅ **Responsive**: Mobile and desktop friendly
- ✅ **Themeable**: Custom themes and styling
- ✅ **Accessible**: ARIA compliant
- ✅ **Performance**: Optimized rendering and tree-shaking

## 🛠️ Development

### Build Library
```bash
npm run build:lib
```

### Create Package
```bash
npm pack
```

### Test Original App
```bash
npm run dev
```

## 📦 Package Information

- **Name**: @uxland/cerberus-calendar
- **Version**: 1.0.0
- **Bundle Size**: 114.5 kB (gzipped)
- **TypeScript**: ✅ Full support with declarations
- **Tree Shakeable**: ✅ ES modules

---

# Original Project Info (Lovable)

**URL**: https://lovable.dev/projects/835876c4-1056-4d7c-b5a0-7d728f97310b

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/835876c4-1056-4d7c-b5a0-7d728f97310b) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/835876c4-1056-4d7c-b5a0-7d728f97310b) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
