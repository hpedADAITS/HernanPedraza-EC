import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  Button,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Menu,
  MenuItem,
  Divider,
  Fab,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { conversationManager } from "../../services/conversationManager";

const ChatHistory = ({ onSelectConversation, currentUser, onLogout }) => {
  const [conversations, setConversations] = useState([]);
  const [openNewDialog, setOpenNewDialog] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = () => {
    setConversations(conversationManager.getAllConversations());
  };

  const handleNewConversation = () => {
    const conv = conversationManager.createConversation(newTitle || undefined);
    loadConversations();
    setNewTitle("");
    setOpenNewDialog(false);
    onSelectConversation(conv.id);
  };

  const handleSelectConversation = (id) => {
    onSelectConversation(id);
  };

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    setDeleteId(id);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      conversationManager.deleteConversation(deleteId);
      loadConversations();
      setDeleteId(null);
    }
    setOpenDeleteDialog(false);
  };

  const handleSettingsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
        pt: "env(safe-area-inset-top)",
        pl: "env(safe-area-inset-left)",
        pr: "env(safe-area-inset-right)",
        background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <AutoStoriesIcon sx={{ fontSize: 28, color: "primary.main" }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            Conversations
          </Typography>
          <IconButton color="inherit" onClick={handleSettingsClick}>
            <SettingsIcon />
          </IconButton>
        </Box>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            elevation: 8,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              zIndex: 1300,
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
          <Box sx={{ p: 2, minWidth: 240 }}>
            <Box sx={{ textAlign: 'center', mb: 1.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.95rem' }}>
                {currentUser}
              </Typography>
            </Box>
            <Divider sx={{ mb: 1.5 }} />
            <MenuItem
              onClick={onLogout}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
            >
              <LogoutIcon fontSize="small" />
              <Typography variant="body2">Logout</Typography>
            </MenuItem>
            <Divider sx={{ mt: 1.5, mb: 1.5 }} />
            <Box sx={{ textAlign: 'center', px: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                Made by Hernan
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block', fontSize: '0.75rem' }}>
                for Sprint 1.5
              </Typography>
            </Box>
          </Box>
        </Menu>
      </Box>

      {/* Content Area */}
      <Box sx={{ flex: 1, overflow: "auto", p: 2, pb: 12 }}>
        {conversations.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              No conversations yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tap the + button to create a new conversation
            </Typography>
          </Box>
        ) : (
          <List sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {conversations.map((conv) => (
              <Card
                key={conv.id}
                sx={{
                  p: 0,
                  hover: {
                    bgcolor: "action.hover",
                  },
                }}
              >
                <ListItem
                  disablePadding
                  secondaryAction={
                    <IconButton
                      edge="end"
                      onClick={(e) => handleDeleteClick(e, conv.id)}
                      size="small"
                      sx={{ mr: 1 }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  }
                >
                  <ListItemButton onClick={() => handleSelectConversation(conv.id)}>
                    <ListItemText
                      primary={conv.title}
                      secondary={formatDate(conv.createdAt)}
                      primaryTypographyProps={{ noWrap: true }}
                    />
                  </ListItemButton>
                </ListItem>
              </Card>
            ))}
          </List>
        )}
      </Box>

      {/* New Conversation Dialog */}
      <Dialog open={openNewDialog} onClose={() => setOpenNewDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>New Conversation</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Title (optional)"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleNewConversation();
              }
            }}
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewDialog(false)}>Cancel</Button>
          <Button onClick={handleNewConversation} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Delete Conversation</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this conversation?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="New Conversation"
        onClick={() => setOpenNewDialog(true)}
        sx={{
          position: "fixed",
          top: "env(safe-area-inset-top)",
          right: "max(16px, env(safe-area-inset-right))",
          zIndex: 1200,
          boxShadow: 4,
          minWidth: 56,
          width: 56,
          height: 56,
          m: 2,
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default ChatHistory;
