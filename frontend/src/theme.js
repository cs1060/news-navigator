import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  styles: {
    global: {
      body: {
        fontSize: '16px', // Larger base font size for better readability
      },
    },
  },
  fonts: {
    heading: '"Segoe UI", system-ui, sans-serif',
    body: '"Segoe UI", system-ui, sans-serif',
  },
  components: {
    Button: {
      baseStyle: {
        _focus: {
          boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.6)', // High contrast focus ring
        },
      },
      defaultProps: {
        size: 'lg', // Larger buttons by default
      },
    },
    Input: {
      defaultProps: {
        size: 'lg', // Larger input fields
      },
    },
    Tag: {
      baseStyle: {
        container: {
          fontSize: 'md', // Larger tags
        },
      },
    },
  },
  colors: {
    blue: {
      50: '#EBF8FF',
      100: '#BEE3F8',
      200: '#90CDF4',
      300: '#63B3ED',
      400: '#4299E1',
      500: '#3182CE',
      600: '#2B6CB0',
      700: '#2C5282',
      800: '#2A4365',
      900: '#1A365D',
    },
  },
});
