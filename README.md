# ab.uom.project

## Project Description
**ab.uom.project** is a **report analysis system** designed for the **HoneyCom e-commerce platform**, providing insights into sales, orders, products, couriers, and customers for business owners with multiple shops. The system uses **AI-powered future predictions** and visualizes data through interactive charts (line, pie, and gauge) to enhance data-driven decision-making.

### Technologies Used:
- **Frontend**: Angular
- **Backend**: .NET
- **Database**: MongoDB
- **Additional Features**: AI for future predictions, interactive chart visualizations

## Features

Below is a more detailed description of the product capabilities, the interactive charting system, and the AI-powered prediction features.

- Sales, orders, and product insights
	- Time-series trends: daily, weekly, monthly and custom-range sales trends with breakdowns by shop, product category, and payment type.
	- Orders funnel: new orders, processed, shipped, delivered and returned counts with conversion and drop-off rates.
	- Product analytics: top-selling products, slow movers, stock alerts and SKU-level revenue and margin reporting. Drill down from category to SKU level with side-by-side comparisons.

- Courier and customer data visualization
	- Courier performance: delivery times, on-time rate, failed-delivery reasons, and courier-wise earnings and charges. Filter by courier partner, zone, or time-window.
	- Customer insights: segmentation (new vs returning, high-value vs occasional), recency-frequency-monetary (RFM) scoring, churn risk and cohort analysis.
	- Geo & location views: map overlays for customer density and courier coverage; heatmaps for order volume by location.

- Interactive charting system (line, pie, gauge)
	- Line charts: interactive time-series for sales and orders with zoom, pan and range selection. Hover to see exact values and click to lock a datapoint for side-by-side comparisons.
	- Pie charts: distribution views for categories such as payment method, product category, or courier share. Click slices to filter dashboards and update all linked charts (cross-filtering).
	- Gauge charts: single-value KPIs (daily revenue, conversion rate, fulfillment SLA) with configurable thresholds and color bands to show Good/Warning/Critical states.
	- Linking & dashboards: charts are linked — applying a filter in one control (date, shop, courier, product) updates all visualizations on the dashboard.
	- Export & share: export charts as PNG/SVG and export underlying data as CSV. Save dashboard views and share short links or scheduled PDF reports.
	- Accessibility & performance: charts lazy-load and paginate large datasets; keyboard navigation and ARIA labels provided for screen readers.

- AI-based future predictions and forecasting
	- What it predicts: short- and medium-term sales forecasts (7/30/90 days), demand spikes, expected returns, and inventory replenishment recommendations.
	- Data sources & features: model input includes historical sales, promotions, product attributes, holidays/events, courier lead-times, and external signals when available (e.g., seasonality and external campaign dates).
	- Model behavior & explainability: predictions surface point estimates and confidence intervals. Each forecast includes an explanation panel listing top contributing features (promotion impact, recent trend, seasonal factor) so users can interpret results.
	- UI controls: toggle predictions on/off, change forecast horizon (7/30/90 days), and simulate scenarios (e.g., "+10% promo", "new courier with faster delivery") to see projected impact.
	- Fallback & offline behavior: when the prediction service is unavailable, the UI shows cached forecasts (if present) and a simple rule-based baseline (e.g., moving-average forecast) with a clear banner that the full model is offline.
	- Retraining & feedback loop: admin workflows allow retraining schedules and manual feedback (accept/reject forecasts). Feedback is stored to improve future model runs.

These features are implemented across the Angular frontend and the .NET backend; the backend aggregates data from MongoDB, computes derived metrics, and exposes endpoints for chart data and predictions. The README's Backend Setup section below has configuration examples for prediction endpoints and secrets.

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


## Gmail Setup
1. Enable 2-Factor Authentication
2. Generate App Password
3. Use App Password in local config