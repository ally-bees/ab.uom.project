# ab.uom.project

## Project Description
**ab.uom.project** is a **report analysis system** designed for the **HoneyCom e-commerce platform**, providing insights into sales, orders, products, couriers, and customers for business owners with multiple shops. The system uses **AI-powered future predictions** and visualizes data through interactive charts (line, pie, and gauge) to enhance data-driven decision-making.

### Technologies Used:
- **Frontend**: Angular
- **Backend**: .NET
- **Database**: MongoDB
- **Additional Features**: AI for future predictions, interactive chart visualizations

## Features
- Sales, orders, and product insights
- Courier and customer data visualization
- AI-based future predictions for decision-making
- Interactive charting (line, pie, gauge)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.14.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.


# Backend Setup

## Local Development Setup

1. Create `appsettings.Local.json` in the Backend folder
2. Add your real credentials (see example below)
3. Never commit this file to Git

### appsettings.Local.json Example:
```json
{
  "MongoDBSettings": {
    "ConnectionString": "your-real-mongo-connection-string"
  },
  "JwtSettings": {
    "Key": "your-real-jwt-secret-key"
  },
  "EmailSettings": {
    "SenderEmail": "your-email@gmail.com",
    "Password": "your-gmail-app-password"
  }
}
```

## Gmail Setup
1. Enable 2-Factor Authentication
2. Generate App Password
3. Use App Password in local config