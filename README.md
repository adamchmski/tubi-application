# Sticky Note Web Application

A modern, interactive web application featuring draggable and resizable sticky notes with real-time saving capabilities. Built with React and modern web technologies.

## Demo

Here's a demonstration of the sticky note component in action:
(In reality it's smooth, but I had to reduce the frame rate of the gif so it would play faster)
![app](/app.gif)

## Features

- **Drag and Drop**: Smooth, intuitive dragging functionality for repositioning notes
- **Resizable**: Notes can be resized dynamically to fit content
- **Real-time Editing**: Double-click to edit note content
- **Auto-saving**: Changes are automatically saved to the server with debouncing
- **Color Customization**: Multiple color options for visual organization
- **Z-index Management**: Smart handling of note layering

## Technical Implementation

The application is built using:

- React.js for the frontend
- Node.js, Express.js and MongoDB for the backend
- Modern JavaScript (ES6+) features
- CSS for styling and animations
- FontAwesome for icons
- Debounced API calls for optimal performance
- ResizeObserver API for dynamic size tracking

### Key Technical Features

- **Debounced Saving**: Implements a 300ms debounce to prevent excessive API calls
- **Event Handling**: Sophisticated mouse event management for drag operations
- **State Management**: Efficient React state and ref usage
- **Cleanup**: Proper cleanup of event listeners and timeouts
- **Error Handling**: Error handling for API calls

## Usage

- Double-click a note to edit its content
- Drag the header to move the note
- Resize by dragging the bottom-right corner
- Click the X button to delete a note
- Notes automatically save when modified
