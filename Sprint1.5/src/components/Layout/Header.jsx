import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppBar, Toolbar, Typography, IconButton, Box, Menu, MenuItem, Divider, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import SettingsIcon from "@mui/icons-material/Settings";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LogoutIcon from "@mui/icons-material/Logout";
import AddIcon from "@mui/icons-material/Add";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import { darkTheme, lightTheme } from "../../theme/theme";
import { conversationManager } from "../../services/conversationManager";

const Header = ({ isDarkMode, onToggleTheme, onBackToHistory, currentUser, onLogout }) => {
  const navigate = useNavigate();
  const { conversationId } = useParams();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleSettingsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNewConversation = () => {
    const newConv = conversationManager.createConversation();
    handleClose();
    navigate(`/conversation/${newConv.id}`);
  };

  const handleDuplicateConversation = () => {
    if (!conversationId) return;
    const duplicated = conversationManager.duplicateConversation(conversationId);
    if (duplicated) {
      handleClose();
      navigate(`/conversation/${duplicated.id}`);
    }
  };

  const handleDeleteClick = () => {
    handleClose();
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (conversationId) {
      conversationManager.deleteConversation(conversationId);
      setOpenDeleteDialog(false);
      if (currentUser) {
        navigate(`/${currentUser}/conversations`);
      }
    }
  };
  return (
    <>
      <AppBar position="sticky" elevation={1} color="transparent">
        <Toolbar>
          {onBackToHistory && (
            <IconButton color="inherit" onClick={onBackToHistory} sx={{ mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
          )}
          <AutoStoriesIcon
            sx={{
              mr: 1,
              color: isDarkMode
                ? darkTheme.palette.primary.main
                : lightTheme.palette.primary.main,
            }}
          />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Botak
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton color="inherit" onClick={handleSettingsClick}>
              <SettingsIcon />
            </IconButton>
            <IconButton color="inherit" onClick={onToggleTheme}>
              <DarkModeIcon />
            </IconButton>
          </Box>
          <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ p: 2, minWidth: 200 }}>
            <Box sx={{ textAlign: 'center', mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {currentUser}
              </Typography>
            </Box>
            <Divider sx={{ mb: 1 }} />
            <MenuItem onClick={handleNewConversation} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AddIcon fontSize="small" />
              <Typography variant="body2">New Conversation</Typography>
            </MenuItem>
            {conversationId && (
              <MenuItem onClick={handleDuplicateConversation} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ContentCopyIcon fontSize="small" />
                <Typography variant="body2">Duplicate</Typography>
              </MenuItem>
            )}
            {conversationId && (
              <MenuItem onClick={handleDeleteClick} sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
                <DeleteIcon fontSize="small" />
                <Typography variant="body2">Delete</Typography>
              </MenuItem>
            )}
            <Divider sx={{ my: 1 }} />
            <MenuItem onClick={onLogout} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LogoutIcon fontSize="small" />
              <Typography variant="body2">Logout</Typography>
            </MenuItem>
            <Divider sx={{ mt: 1, mb: 1 }} />
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Made by Hernan
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                for Sprint 1.5
              </Typography>
            </Box>
          </Box>
          </Menu>
        </Toolbar>
      </AppBar>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Delete Conversation</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this conversation? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Header;
