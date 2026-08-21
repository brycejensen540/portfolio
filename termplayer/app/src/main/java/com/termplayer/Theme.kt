package com.termplayer

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily

// ── Terminal palette ──────────────────────────────────────────────
val TerminalGreen     = Color(0xFF00FF00)   // bright phosphor green
val TerminalDimGreen  = Color(0xFF00AA00)   // dimmed / secondary
val TerminalDarkGreen = Color(0xFF004400)   // dividers / borders
val TerminalBg        = Color(0xFF000000)   // pure black

/** Monospace font used everywhere. */
val TerminalFont = FontFamily.Monospace

// ── Material3 scheme (green-on-black) ────────────────────────────
private val TerminalColorScheme = darkColorScheme(
    primary            = TerminalGreen,
    onPrimary          = TerminalBg,
    background         = TerminalBg,
    onBackground       = TerminalGreen,
    surface            = TerminalBg,
    onSurface          = TerminalGreen,
    primaryContainer   = TerminalDarkGreen,
    onPrimaryContainer = TerminalGreen,
    secondary          = TerminalDimGreen,
    onSecondary        = TerminalBg,
    surfaceVariant     = TerminalBg,
    onSurfaceVariant   = TerminalGreen,
)

@Composable
fun TermPlayerTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = TerminalColorScheme,
        content = content
    )
}
