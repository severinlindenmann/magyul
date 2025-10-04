import React, { useState, useId } from 'react';
import { Box, Collapse, IconButton, Typography, Paper } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  dense?: boolean; // smaller paddings
}

/**
 * Lightweight custom collapsible section used inside long grammar pages to reduce cognitive overload.
 * Uses MUI Collapse for height animation and keeps DOM mounted for accessibility / screen readers.
 */
const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, defaultOpen = false, children, dense }) => {
  const [open, setOpen] = useState(defaultOpen);
  const labelId = useId();

  return (
    <Paper variant="outlined" sx={{ mb: 2, overflow: 'hidden', bgcolor: open ? 'background.paper' : 'grey.50' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: dense ? 1.5 : 2,
          py: dense ? 1 : 1.25,
          cursor: 'pointer',
          userSelect: 'none',
          '&:hover': { bgcolor: 'action.hover' }
        }}
        role="button"
        aria-expanded={open}
        aria-controls={labelId}
        tabIndex={0}
        onClick={() => setOpen(o => !o)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(o => !o); } }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{title}</Typography>
        <IconButton size="small" aria-label={open ? 'collapse' : 'expand'} onClick={(e) => { e.stopPropagation(); setOpen(o => !o); }} sx={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform .25s' }}>
          <ExpandMoreIcon />
        </IconButton>
      </Box>
      <Collapse in={open} timeout={250} unmountOnExit={false} appear>
        <Box id={labelId} sx={{ px: dense ? 1.5 : 2, pb: dense ? 1.5 : 2, pt: 0 }}>
          {children}
        </Box>
      </Collapse>
    </Paper>
  );
};

export default CollapsibleSection;
