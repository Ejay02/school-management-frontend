# School Management System - Frontend

A comprehensive school management system built with Vue 3 that helps educational institutions streamline their administrative processes, enhance communication between stakeholders, and manage academic activities efficiently.

## Features

### Dashboard

- Real-time overview of school metrics
- Quick access to important notifications
- Visual representation of attendance and performance statistics
- Recent activities feed
- Financial insights and fee collection status

### User Management

- Role-based access control (Admin, Teacher, Student, Parent)
- Profile management with avatar customization
- Contact information and emergency details
- Document uploads and verification
- Account status management

### Class Management

- Create and manage multiple class sections
- Assign teachers to classes
- Student enrollment management
- Class schedule visualization
- Subject and curriculum mapping

### Academic Tools

#### Assignments

- Create and distribute assignments
- File attachments support
- Submission tracking
- Plagiarism checking
- Automated reminders for deadlines

#### Exams

- Exam schedule management
- Question paper creation
- Online assessment capabilities
- Result compilation
- Performance analytics

#### Results

- Comprehensive result management
- Progress report generation
- Performance tracking over time
- Custom grading systems
- Parent notification system

### Communication

#### Announcements

- School-wide announcements
- Class-specific notifications
- Priority-based messaging
- Rich text editor support
- Attachment capabilities

#### Events

- School calendar management
- Event scheduling and registration
- Reminder system
- Attendance tracking for events
- Resource allocation for venues

### Administrative Tools

#### Attendance

- Daily attendance tracking
- Multiple attendance sessions per day
- Automated absence notifications
- Monthly attendance reports
- Leave management system

## Technical Stack

### Core Technologies

- **Vue 3**: Frontend framework using Composition API
- **Vite**: Build tool for faster development
- **Pinia**: State management solution
- **Vue Router**: For application routing

### UI/UX

- **Tailwind CSS**: Utility-first styling
- **Chart.js**: Data visualization
- **VCalendar**: Calendar and date picking

### Development Tools

- **ESLint**: Code quality
- **Prettier**: Code formatting
- **Vitest**: Unit testing
- **Cypress**: E2E testing

## Getting Started

### Prerequisites

```bash
Node.js >= 16.0.0
npm >= 7.0.0
```

### Installation

```bash
# Clone the repository
git clone https://github.com/Ejay02/school-management-frontend.git

# Navigate to the project directory
cd school-management-frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start the development server
npm run dev
```

### Environment Configuration

```env
VITE_API_URL=your_backend_url
VITE_HUGGINGFACE_API_KEY=your hugging face api key
```

## Development

### Building for Production

```bash
# Type check
npm run type-check

# Run tests
npm run test

# Build
npm run build
```

### Testing

```bash
# Unit tests
npm run test:unit

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Best Practices

### Code Style

- Follow Vue 3 Composition API patterns

### State Management

- Use Pinia for global state
- Implement proper error handling
- Maintain loading states
- Cache API responses appropriately

### Performance

- Lazy load routes and components
- Optimize image assets
- Implement proper caching strategies
- Monitor bundle size

## Support

For support, please email e.jae02@gmail.com.

## Acknowledgements

This project utilizes the following open-source libraries:

- Unsplash: For high-quality placeholder images. [Explore here](https://unsplash.com/)
- Hugging Face Gemma-2B Model: For any NLP capabilities integrated into the platform. [Explore the Gemma-2B model](https://huggingface.co/google/gemma-2-2b-it).
- Pexels: For high quality videos. [Explore Pexels](https://www.pexels.com/)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
