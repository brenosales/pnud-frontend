# 👥 User Management System

A modern, responsive Angular application for managing users with full CRUD operations, built following Test-Driven Development (TDD) principles and Angular best practices.

![Angular](https://img.shields.io/badge/Angular-18.x-red?style=flat-square&logo=angular)
![Material Design](https://img.shields.io/badge/Material%20Design-3.x-blue?style=flat-square&logo=material-design)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)
![Tests](https://img.shields.io/badge/Tests-56%20passing-green?style=flat-square)
![Test Coverage](https://img.shields.io/badge/Coverage-High-green?style=flat-square)

## 🚀 **Features**

### 📋 **Core Functionality**
- **User Listing**: Paginated table with sorting, filtering, and search
- **User Creation**: Reactive form with real-time validation
- **User Editing**: Pre-populated form for updating user information
- **User Details**: Comprehensive view of user information
- **User Deletion**: Safe deletion with confirmation dialogs

### 🎨 **User Experience**
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Material Design**: Professional, consistent UI components
- **Real-time Search**: Instant filtering with highlighted results
- **Loading States**: Clear feedback during async operations
- **Error Handling**: User-friendly error messages with retry options

### 🏗️ **Technical Features**
- **Standalone Components**: Modern Angular architecture
- **Lazy Loading**: Optimized performance with route-based code splitting
- **Reactive Forms**: Type-safe forms with comprehensive validation
- **Custom Pipes**: Data formatting and transformation
- **Custom Directives**: Enhanced UI interactions
- **RxJS**: Reactive programming patterns
- **Comprehensive Testing**: 56 unit tests with high coverage

## 🛠️ **Technology Stack**

| Technology | Version | Purpose |
|------------|---------|---------|
| **Angular** | 18.x | Frontend framework |
| **Angular Material** | 18.x | UI component library |
| **TypeScript** | 5.x | Programming language |
| **RxJS** | 7.x | Reactive programming |
| **Jasmine/Karma** | Latest | Testing framework |
| **SCSS** | Latest | Styling |

## 📦 **Installation & Setup**

### **Prerequisites**
- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (v18 or higher)

### **Installation Steps**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd user-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200`

## 🧪 **Testing**

This project follows **Test-Driven Development (TDD)** principles with comprehensive test coverage.

### **Run Tests**
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### **Test Categories**
- **Unit Tests**: 56 tests covering services, components, pipes, and directives
- **Integration Tests**: Component interaction testing
- **E2E Tests**: Full user journey testing (ready for implementation)

### **Test Statistics**
- ✅ **56 tests passing**
- 🎯 **High test coverage**
- 🔄 **Continuous integration ready**

## 🏛️ **Architecture**

### **Project Structure**
```
src/
├── app/
│   ├── core/                    # Core functionality
│   │   ├── models/             # TypeScript interfaces
│   │   └── services/           # Business logic services
│   ├── shared/                 # Reusable components
│   │   ├── pipes/              # Custom pipes
│   │   └── directives/         # Custom directives
│   ├── users/                  # User management feature
│   │   ├── components/         # Feature components
│   │   └── users.routes.ts     # Feature routing
│   ├── app.routes.ts           # Main routing
│   └── app.config.ts           # App configuration
└── styles.scss                # Global styles
```

### **Design Patterns**
- **Feature Modules**: Organized by functionality
- **Standalone Components**: Modern Angular architecture
- **Reactive Programming**: RxJS for state management
- **Service Layer**: Separation of concerns
- **Observer Pattern**: Event-driven updates

## 🎯 **Usage Guide**

### **User List View**
- **Browse Users**: View paginated list of users
- **Search**: Real-time search by name or email
- **Filter**: Filter by user status (active/inactive)
- **Sort**: Click column headers to sort
- **Actions**: View, edit, or delete users

### **User Form**
- **Create User**: Fill out the form with user details
- **Edit User**: Modify existing user information
- **Validation**: Real-time validation with helpful messages
- **Status**: Set user as active or inactive

### **User Details**
- **Profile Information**: Complete user profile view
- **Contact Details**: Phone, email, and website
- **Address**: Full address with map integration
- **Company**: Business information and details

## 🔧 **Development**

### **Development Server**
```bash
npm start
```
Navigate to `http://localhost:4200` for live reload.

### **Build**
```bash
# Development build
npm run build

# Production build
npm run build:prod
```

### **Linting**
```bash
npm run lint
```

### **Code Formatting**
```bash
npm run format
```

## 📝 **API Integration**

### **Data Source**
The application uses [JSONPlaceholder](https://jsonplaceholder.typicode.com/) for demo data:
- **GET** `/users` - Fetch all users
- **GET** `/users/{id}` - Fetch user by ID
- **POST** `/users` - Create user (simulated)
- **PUT** `/users/{id}` - Update user (simulated)
- **DELETE** `/users/{id}` - Delete user (simulated)

### **Service Layer**
The `UserService` provides:
- **CRUD Operations**: Create, Read, Update, Delete
- **Error Handling**: Comprehensive error management
- **Loading States**: Progress indicators
- **Caching**: Optimized data fetching

## 🎨 **Customization**

### **Themes**
The application uses Angular Material themes. To customize:
1. Edit `src/styles.scss`
2. Modify Material theme variables
3. Update component-specific styles

### **Adding Features**
1. Create feature module: `ng generate module feature-name`
2. Add routing: Update routes configuration
3. Implement components following existing patterns
4. Write tests following TDD principles

## 🚀 **Deployment**

### **Production Build**
```bash
npm run build:prod
```

### **Deployment Platforms**
- **Vercel**: Zero-config deployment
- **Firebase Hosting**: Google Cloud integration
- **Netlify**: Continuous deployment
- **GitHub Pages**: Free static hosting

### **Environment Configuration**
Configure environment variables in:
- `src/environments/environment.ts` (development)
- `src/environments/environment.prod.ts` (production)

## 🤝 **Contributing**

### **Development Workflow**
1. **Fork** the repository
2. **Create** a feature branch
3. **Write tests** following TDD principles
4. **Implement** the feature
5. **Ensure all tests pass**
6. **Submit** a pull request

### **Code Standards**
- Follow Angular style guide
- Use TypeScript strict mode
- Write comprehensive tests
- Use meaningful commit messages
- Follow conventional commits

## 📈 **Performance**

### **Optimizations**
- **Lazy Loading**: Route-based code splitting
- **OnPush Strategy**: Optimized change detection
- **Debounced Search**: Reduced API calls
- **Virtual Scrolling**: Efficient list rendering
- **Tree Shaking**: Minimal bundle size

### **Metrics**
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Bundle Size**: Optimized for production

## 🔒 **Security**

### **Best Practices**
- **HTTPS**: Secure communication
- **Input Validation**: Client and server-side
- **XSS Protection**: Sanitized data display
- **CSRF Protection**: Token-based validation
- **Content Security Policy**: Enhanced security headers

## 📚 **Resources**

### **Documentation**
- [Angular Documentation](https://angular.dev)
- [Angular Material](https://material.angular.io)
- [RxJS Guide](https://rxjs.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

### **Learning**
- [Angular Tutorial](https://angular.dev/tutorial)
- [Material Design Guidelines](https://material.io)
- [TDD Principles](https://www.agilealliance.org/glossary/tdd)

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 👨‍💻 **Author**

Built with ❤️ following Test-Driven Development principles and Angular best practices.

---

**Happy Coding! 🚀**