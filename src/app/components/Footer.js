'use client'
import { Box, Typography, Link, Container } from '@mui/material'
import { useTheme } from '@mui/material/styles'

const drawerWidth = 240

export default function Footer() {
  const theme = useTheme();
  
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: theme.palette.mode === 'dark' 
          ? 'background.paper'
          : 'background.default',
        borderTop: 1,
        borderColor: theme.palette.mode === 'dark'
          ? 'rgba(255, 255, 255, 0.1)'
          : 'rgba(0, 0, 0, 0.1)',
      }}
    >
      <Container maxWidth="lg">
        <Typography 
          variant="body2" 
          color="text.secondary" 
          align="center"
        >
          {'Copyright © '}
          <Link 
            color="inherit" 
            href="/"
            sx={{
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
                color: 'primary.main'
              }
            }}
          >
            Security Icons
          </Link>{' '}
          {new Date().getFullYear()}
        </Typography>
      </Container>
    </Box>
  );
} 