# Water for Change Project

A web-based calculator for analyzing water management systems through Technology and Environment realms.

## Overview

This project provides a user-friendly interface to calculate and analyze water management systems using two main realms:

1. **Technology Realm** - Calculated using 5 indicators:
   - Resilience
   - Robust Infrastructure
   - Drainage Network
   - Rainfall Harvesting
   - Recycling of Wastewater

2. **Environment Realm** - Calculated using 2 indicators:
   - Enabling Pleasant Connected Urban Green-Blue Spaces
   - Water Circularity

## Features

- Real-time calculations
- Responsive design
- User-friendly interface
- Detailed breakdown of each indicator
- Automatic realm score calculation

## Usage

1. Open `index.html` in a web browser
2. Enter the required values for each indicator
3. View the calculated scores in real-time
4. The final realm scores will be displayed at the bottom of each section

## Technical Details

- Built with HTML5, CSS3, and JavaScript
- No external dependencies required
- Responsive design works on desktop and mobile devices
- All calculations are performed client-side

## Formulas

### Technology Realm Indicators

1. **Resilience Score**
   ```
   1 - (Affected area during urban flooding)/(City Area)
   ```

2. **Robust Infrastructure**
   ```
   1 - (Affected population during the failure in a year)/(Total population)
   ```

3. **Drainage Network**
   ```
   Area of the city with drainage lines / Total city area
   ```

4. **Rainfall Harvesting**
   ```
   Harvested water (D) / Effective precipitation (P)
   ```

5. **Recycling of Wastewater**
   ```
   Reuse and recycling of wastewater (Re) / Total water supplies to the city (C)
   ```

### Environment Realm Indicators

1. **Urban Green-Blue Spaces Ratio**
   ```
   Green blue area / City area
   ```

2. **Water Circularity**
   ```
   (Volume of reused wastewater + volume of harvested rainwater) / (volume of generated wastewater + volume of total effective rainfall)
   ```

## License

This project is open source and available for public use. 