# Mortgage Trend Tracker

A sleek, real-time mortgage rate dashboard that tracks interest rate trends using live Federal Reserve Economic Data (FRED) API. Built with React, TypeScript, and Vite.

![Dashboard Preview](https://via.placeholder.com/800x400/3b82f6/ffffff?text=Mortgage+Trend+Tracker)

## 🚀 Features

- **Real-time Treasury Data**: Fetch 10-Year Treasury yields from FRED API
- **Mortgage Rate Estimation**: Calculate estimated 30-year mortgage rates using Treasury yield + adjustable spread
- **Interactive Visualization**: Chart.js powered trend charts with multiple time ranges
- **Plain English Explanations**: No financial jargon - explanations anyone can understand
- **Mobile-First Design**: Responsive UI with Tailwind CSS
- **Educational Content**: Built-in glossary and explainers about bonds, yields, and mortgage rates
- **Data Export**: Export historical data as CSV files

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3
- **Charts**: Chart.js + react-chartjs-2
- **Data Source**: Federal Reserve Economic Data (FRED) API
- **Code Quality**: ESLint + Prettier

## 📋 Prerequisites

1. **FRED API Key** (free): Get yours at https://fred.stlouisfed.org/docs/api/api_key.html
2. **Node.js** (v18 or higher)
3. **npm** or **yarn**

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd bond-mortgage-dashboard
npm install
```

### 2. Environment Setup

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your FRED API key:

```bash
VITE_FRED_API_KEY=your_actual_fred_api_key_here
```

> **Note**: Vite exposes environment variables prefixed with `VITE_` to the browser via `import.meta.env`

### 3. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 to see the dashboard.

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🗂️ Project Structure

```
src/
├── api/
│   ├── fred.ts              # FRED API integration
│   └── treasuryXml.ts       # Treasury XML fallback (optional)
├── lib/
│   ├── math.ts              # Mortgage rate calculations
│   ├── format.ts            # Display formatting utilities
│   └── dates.ts             # Date/time helpers
├── components/
│   ├── Layout/
│   │   ├── Header.tsx       # App header with refresh
│   │   └── Footer.tsx       # Footer with data sources
│   ├── Cards/
│   │   ├── StatCard.tsx     # Big number display cards
│   │   └── DeltaBadge.tsx   # Change indicators
│   ├── Controls/
│   │   └── SpreadControl.tsx # Spread adjustment slider
│   ├── Charts/
│   │   └── TrendChart.tsx   # Interactive line charts
│   └── Info/
│       ├── Explainers.tsx   # Educational content
│       └── Glossary.tsx     # Financial terms glossary
├── pages/
│   └── Dashboard.tsx        # Main dashboard page
├── types/
│   └── index.ts             # TypeScript definitions
├── App.tsx                  # Root component
├── main.tsx                 # App entry point
└── styles.css               # Global styles + Tailwind
```

## 🔄 Data Flow

1. **Load**: Dashboard fetches Treasury yield data from FRED API
2. **Calculate**: Applies user-selected spread to estimate mortgage rates
3. **Display**: Shows current rates, deltas, and historical trends
4. **Interact**: Users adjust spread slider to see rate impact
5. **Export**: Users can download data as CSV

## 📊 Data Sources

- **Primary**: [Federal Reserve Economic Data (FRED)](https://fred.stlouisfed.org/)
  - 10-Year Treasury Constant Maturity Rate (DGS10)
  - 30-Year Fixed Rate Mortgage Average (MORTGAGE30US)
- **Fallback**: U.S. Treasury XML (work in progress)

## 🎨 Design Philosophy

- **Beginner-Friendly**: No financial jargon, plain English explanations
- **Mobile-First**: Responsive design that works on all devices
- **Accessible**: ARIA labels, keyboard navigation, high contrast
- **Fast**: Optimized loading with skeleton states and caching

## 🔧 Customization

### Modify Spread Presets

Edit `src/components/Controls/SpreadControl.tsx`:

```typescript
const presets = [
  { label: 'Conservative', value: 1.5 },
  { label: 'Typical', value: 1.9 },
  { label: 'High-Risk', value: 2.4 },
];
```

### Change Time Ranges

Edit `src/components/Charts/TrendChart.tsx`:

```typescript
const timeRangeOptions = [
  { value: '30d', label: '30 Days' },
  { value: '90d', label: '90 Days' },
  { value: '180d', label: '6 Months' },
  { value: '365d', label: '1 Year' },
];
```

### Update Colors

Edit `tailwind.config.js` to change the color scheme:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#your-color',
        600: '#your-darker-color',
      },
    },
  },
}
```

## 🚦 Next Steps

After getting the basic setup running, here are suggested next steps:

1. **API Integration**: 
   - Add your FRED API key to `.env.local`
   - Implement real API calls in `src/api/fred.ts`

2. **Enhanced Features**:
   - Add more Treasury maturities (2Y, 5Y, 30Y)
   - Implement rate change alerts
   - Add mortgage calculator
   - Include regional rate data

3. **Data Improvements**:
   - Implement Treasury XML fallback
   - Add caching layer
   - Include more economic indicators

4. **UI Enhancements**:
   - Dark mode toggle
   - Custom time range picker
   - Mobile app wrapper

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This dashboard is for **educational and informational purposes only**. The mortgage rate estimates are approximations based on Treasury data and should not be considered actual rate quotes. Always consult with qualified mortgage professionals for real rate quotes and financial advice.

## 📞 Support

- Create an [Issue](../../issues) for bugs or feature requests
- Check the [Wiki](../../wiki) for detailed documentation
- Join discussions in [GitHub Discussions](../../discussions)

---

**Built with ❤️ for financial education and transparency**
