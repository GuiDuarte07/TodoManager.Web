"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Box, Avatar } from "@mui/material"
import { TaskAltRounded, AccountCircleRounded, LogoutRounded, SettingsRounded } from "@mui/icons-material"
import { useAuthStore } from "@/store/auth.store"

export function AppHeader() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    logout()
    router.push("/auth/login")
  }

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{ bgcolor: "white", borderBottom: "1px solid", borderColor: "grey.200" }}
    >
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexGrow: 1 }}>
          <TaskAltRounded sx={{ fontSize: 32, color: "primary.main" }} />
          <Typography variant="h6" component="div" sx={{ fontWeight: 700, color: "text.primary" }}>
            Todo Manager
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Typography variant="body2" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>

          <IconButton onClick={handleMenuOpen} size="large">
            <Avatar sx={{ width: 40, height: 40, bgcolor: "primary.main" }}>
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem onClick={handleMenuClose}>
              <AccountCircleRounded sx={{ mr: 1 }} />
              Perfil
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <SettingsRounded sx={{ mr: 1 }} />
              Configurações
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutRounded sx={{ mr: 1 }} />
              Sair
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
